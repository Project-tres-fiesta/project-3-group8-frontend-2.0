// __tests__/UserScreen.test.tsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import UsersScreen from "../app/(tabs)/UserScreen";

// ---- Mocks ----

// mock SecureStore
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(() => Promise.resolve("fake-jwt")),
}));

// mock safe area
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// mock Themed components (correct paths)
jest.mock("../components/themed-view", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: ({ children, ...rest }: any) => (
      <View {...rest}>{children}</View>
    ),
  };
});

jest.mock("../components/themed-text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children, ...rest }: any) => (
      <Text {...rest}>{children}</Text>
    ),
  };
});

// ---- Helper fetch mock ----
const mockProfile = {
  userId: 1,
  userName: "Me",
  userEmail: "me@example.com",
};

const mockUsers = [
  { userId: 1, userName: "Me", userEmail: "me@example.com" },
  { userId: 2, userName: "Alice", userEmail: "alice@example.com" },
  { userId: 3, userName: "Bob", userEmail: "bob@example.com" },
];

const mockFriends: any[] = []; // no accepted friends
const mockPending: any[] = []; // no pending friendships

beforeEach(() => {
  (global as any).fetch = jest.fn((url: string) => {
    if (url.endsWith("/api/users/profile")) {
      return Promise.resolve({
        ok: true,
        json: async () => mockProfile,
      } as Response);
    }
    if (url.endsWith("/api/users")) {
      return Promise.resolve({
        ok: true,
        json: async () => mockUsers,
      } as Response);
    }
    if (url.endsWith("/api/friendships/friends-users")) {
      return Promise.resolve({
        ok: true,
        json: async () => mockFriends,
      } as Response);
    }
    if (url.endsWith("/api/friendships/pending")) {
      return Promise.resolve({
        ok: true,
        json: async () => mockPending,
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UsersScreen", () => {
  it("renders header and filtered users", async () => {
    const { findByText, queryByText } = render(<UsersScreen />);

    // wait until the header appears (loading state is gone)
    expect(await findByText("Find Friends")).toBeTruthy();

    await waitFor(() => {
      // "Me" should be filtered out
      expect(queryByText("Me")).toBeNull();
      // Alice and Bob should be visible
      expect(queryByText("Alice")).toBeTruthy();
      expect(queryByText("Bob")).toBeTruthy();
    });
  });

  it("sends friend request when pressing Add friend", async () => {
    const fetchSpy = jest.spyOn(global as any, "fetch");

    const { findByText, findAllByText } = render(<UsersScreen />);

    // wait until Alice is rendered (i.e., data loaded)
    await findByText("Alice");

    // There are multiple "Add friend" buttons (Alice & Bob) — pick the first
    const addButtons = await findAllByText("Add friend");
    const addButton = addButtons[0];

    fireEvent.press(addButton);

    await waitFor(() => {
      const calls = fetchSpy.mock.calls;

      // specifically find the POST to /api/friendships
      const friendshipCall = calls.find(([url, options]) => {
        const opts = (options || {}) as RequestInit;
        return (
          String(url).includes("/api/friendships") &&
          opts.method === "POST"
        );
      });

      expect(friendshipCall).toBeDefined();

      const options = friendshipCall![1] as RequestInit;
      expect(options.method).toBe("POST");
    });
  });
});