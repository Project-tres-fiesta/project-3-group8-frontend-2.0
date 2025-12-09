// __tests__/GroupDetailsPage.test.tsx
import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import GroupDetailsPage from "../app/(tabs)/GroupDetailsPage";

// Mock expo-router so we always get a groupId
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ groupId: "1" }),
}));

// ThemedView -> simple View wrapper
jest.mock("../components/themed-view", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: (props: any) => <View {...props}>{props.children}</View>,
  };
});

// ThemedText -> real Text so text matching works as expected
jest.mock("../components/themed-text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props: any) => <Text {...props}>{props.children}</Text>,
  };
});

// Provide a basic localStorage for the component to read JWT from
beforeAll(() => {
  (global as any).localStorage = {
    getItem: jest.fn(() => "fake-jwt"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("GroupDetailsPage", () => {
  it("renders group events and members from API", async () => {
    // Mock fetch sequence:
    // 1) GET /api/groupEvents/1  -> [101]
    // 2) GET /api/events/stored/101 -> { event: { ... } }
    // 3) GET /api/groupMembers/group/1 -> [10]
    // 4) GET /api/users/10 -> { ...user }
    (global as any).fetch = jest
      .fn()
      // 1) groupEvents
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [101],
      } as any)
      // 2) stored event
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          event: {
            id: 101,
            title: "Test Event",
            description: "A cool test event",
            eventDate: "2025-12-10",
            eventTime: "19:00:00",
            imageUrl: "",
            venueName: "Test Arena",
            venueCity: "Test City",
            venueState: "CA",
            venueCountry: "US",
            category: "Sports",
            genre: "Basketball",
            eventUrl: "https://example.com/event",
          },
        }),
      } as any)
      // 3) group members
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [10],
      } as any)
      // 4) user details
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userId: 10,
          userName: "Alice User",
          userEmail: "alice@example.com",
          profilePicture: null,
        }),
      } as any);

    const { getByText } = render(<GroupDetailsPage />);

    // Wait for the group title to appear
    await waitFor(() => {
      expect(getByText("Group ID: 1")).toBeTruthy();
    });

    // Event title rendered
    expect(getByText("Test Event")).toBeTruthy();

    // Member name rendered
    expect(getByText("Alice User")).toBeTruthy();
  });
});