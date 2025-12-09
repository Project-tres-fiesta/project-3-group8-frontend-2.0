// __tests__/FriendsPage.test.tsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";

// Adjust this import if FriendsPage lives somewhere else
import FriendsPage from "../app/FriendsPage";

// --- Mocks ---

// Mock SecureStore so getJwt() returns a fake token
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(() => Promise.resolve("fake-jwt")),
}));

// Mock safe area insets
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Ionicons (we don’t care about actual icon rendering in tests)
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

// ✅ Name starts with "mock", so Jest allows it in the mock factory
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Helper to mock fetch for different calls
const mockFetch = (data: any, ok = true, status = 200) => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    } as Response)
  );
};

describe("FriendsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading indicator and then renders list of friends", async () => {
    const friends = [
      {
        userId: 1,
        userName: "Alice",
        userEmail: "alice@example.com",
        profilePicture: null,
      },
      {
        userId: 2,
        userName: "Bob",
        userEmail: "bob@example.com",
        profilePicture: null,
      },
    ];

    mockFetch(friends);

    const { getByText, queryByText } = render(<FriendsPage />);

    // Loading state
    expect(getByText("Loading friends...")).toBeTruthy();

    // Wait for friends to load
    await waitFor(() => {
      expect(queryByText("Loading friends...")).toBeNull();
      expect(getByText("Alice")).toBeTruthy();
      expect(getByText("Bob")).toBeTruthy();
    });

    // Ensure fetch was called with the friends endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/friendships\/friends-users$/),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-jwt",
        }),
      })
    );
  });

  it("shows empty state when there are no friends", async () => {
    mockFetch([]); // backend returns empty array

    const { getByText, queryByText } = render(<FriendsPage />);

    // Loading first
    expect(getByText("Loading friends...")).toBeTruthy();

    // Then empty state
    await waitFor(() => {
      expect(queryByText("Loading friends...")).toBeNull();
      expect(getByText("No friends yet")).toBeTruthy();
      expect(
        getByText("Send and accept friend requests to see them here.")
      ).toBeTruthy();
    });
  });

  it("navigates to FriendEventsPage when a friend row is pressed", async () => {
    const friends = [
      {
        userId: 10,
        userName: "Charlie",
        userEmail: "charlie@example.com",
        profilePicture: null,
      },
    ];
    mockFetch(friends);

    const { getByText } = render(<FriendsPage />);

    // Wait until friend row appears
    const friendRow = await waitFor(() => getByText("Charlie"));

    // Tap the row
    fireEvent.press(friendRow);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/FriendEventsPage",
      params: {
        friendId: "10",
        friendName: "Charlie",
      },
    });
  });
});