// __tests__/ProfilePage.test.tsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Platform, Alert } from "react-native";

// ✅ mock expo-router so we can assert navigation
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// ✅ mock safe-area
jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ✅ mock SecureStore (used on native)
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// import _after_ mocks
import ProfileScreen from "../app/(tabs)/ProfilePage";
import * as SecureStore from "expo-secure-store";

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    global.fetch = jest.fn();

    // web localStorage mock
    // @ts-ignore
    global.localStorage = {
      getItem: jest.fn(),
      removeItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    // jsdom window.localStorage
    // @ts-ignore
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.localStorage = global.localStorage;
    }

    // ✅ make Alert.alert a no-op so it never throws
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  test("renders user name + email from /api/users/profile", async () => {
    Platform.OS = "web";

    (global.localStorage.getItem as jest.Mock).mockReturnValue("test-jwt");

    // 1) profile
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 10,
          userName: "Test User",
          userEmail: "test@example.com",
        }),
      })
      // 2) friends-users
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // 3) user-events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Test User")).toBeTruthy();
      expect(getByText("test@example.com")).toBeTruthy();
    });
  });

  test("sign out clears JWT and navigates to root", async () => {
    Platform.OS = "web";

    (global.localStorage.getItem as jest.Mock).mockReturnValue("test-jwt");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 10,
          userName: "Test User",
          userEmail: "test@example.com",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    const { getByTestId } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByTestId("signOutButton")).toBeTruthy();
    });

    fireEvent.press(getByTestId("signOutButton"));

    // 🔑 wait for the async handler to finish
    await waitFor(() => {
      expect(global.localStorage.removeItem).toHaveBeenCalledWith("jwt");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  test("uses SecureStore on native", async () => {
    Platform.OS = "ios";

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("native-jwt");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 10,
          userName: "Native User",
          userEmail: "native@example.com",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    const { getByTestId, getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Native User")).toBeTruthy();
    });

    fireEvent.press(getByTestId("signOutButton"));

    // 🔑 wait for async clear + navigation
    await waitFor(() => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("jwt");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});