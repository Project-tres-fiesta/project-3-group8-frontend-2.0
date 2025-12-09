import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomePage from "../app/(tabs)/HomePage";
import { useRouter } from "expo-router";

// ✅ Mock router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// ✅ Mock safe-area so useSafeAreaInsets works in tests
jest.mock("react-native-safe-area-context", () => {
  return {
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ✅ Mock ThemedView
jest.mock("../components/themed-view", () => ({
  ThemedView: ({ children }: any) => <>{children}</>,
}));

// ✅ Mock ThemedText (use require *inside* factory so Jest is happy)
jest.mock("../components/themed-text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children }: any) => <Text>{children}</Text>,
  };
});

// ✅ Mock Ionicons to avoid act(...) warnings
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => <Text>{props.children}</Text>,
  };
});

describe("HomePage", () => {
  it("renders the hero title and subtitle", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { getByText } = render(<HomePage />);

    expect(getByText("Welcome to EventLink")).toBeTruthy();
    expect(
      getByText(
        "Discover events, see where your friends are going, and never miss the action."
      )
    ).toBeTruthy();
  });

  it("renders feature cards", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { getByText } = render(<HomePage />);

    expect(getByText("Buy Tickets Easily")).toBeTruthy();
    expect(getByText("Friends & Social")).toBeTruthy();
    expect(getByText("Groups & Plans")).toBeTruthy();
  });

  it("navigates to EventsPage when Browse Events is pressed", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { getByText } = render(<HomePage />);

    const button = getByText("Browse Events");
    fireEvent.press(button);

    expect(mockPush).toHaveBeenCalledWith("/EventsPage");
  });
});