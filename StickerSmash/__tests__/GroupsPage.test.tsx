// __tests__/GroupsPage.test.tsx

import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import GroupsPage from "../app/(tabs)/GroupsPage"; // <-- change path if needed

// Mock expo-router so useRouter() doesn’t blow up
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Very small mock for ThemedView/Text if they do anything fancy.
// If your existing tests already mock these, you can remove this block.
jest.mock("../components/themed-view", () => {
  const React = require("react");
  return {
    ThemedView: ({ children, ...rest }: any) =>
      React.createElement("View", rest, children),
  };
});

jest.mock("../components/themed-text", () => {
  const React = require("react");
  return {
    ThemedText: ({ children, ...rest }: any) =>
      React.createElement("Text", rest, children),
  };
});

// Provide a basic localStorage for the component to read jwt from
beforeAll(() => {
  (global as any).localStorage = {
    getItem: jest.fn().mockReturnValue("fake-jwt"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

// Mock fetch for all calls inside GroupsPage
beforeEach(() => {
  (global as any).fetch = jest.fn((url: string, _opts?: any) => {
    if (url.includes("/api/users/profile")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ userId: 123 }),
      });
    }

    if (url.includes("/api/groups")) {
      // used both for initial fetch and after create
      return Promise.resolve({
        ok: true,
        json: async () => [
          { groupId: 1, groupName: "Test Group 1" },
          { groupId: 2, groupName: "Test Group 2" },
        ],
      });
    }

    if (url.includes("/api/groupMembers/add")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    }

    if (url.includes("/api/groups") && _opts?.method === "POST") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ groupId: 3, groupName: "Created Group" }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GroupsPage", () => {
  it("renders header and loads groups from backend", async () => {
    const { getByText } = render(<GroupsPage />);

    // Header is visible immediately
    expect(getByText("Your Groups")).toBeTruthy();

    // Groups loaded via fetch
    await waitFor(() => {
      expect(getByText("Test Group 1")).toBeTruthy();
      expect(getByText("Test Group 2")).toBeTruthy();
    });
  });

  it("opens the create group modal when Create Group is pressed", () => {
    const { getByText } = render(<GroupsPage />);

    const button = getByText("Create Group");
    fireEvent.press(button);

    expect(getByText("Create a New Group")).toBeTruthy();
  });
});