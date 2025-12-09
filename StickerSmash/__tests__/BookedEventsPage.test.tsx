import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import BookedEventsPage from "../app/(tabs)/BookedEventsPage";

// Mock SecureStore
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue("fake-jwt"),
}));

// Mock Linking so test doesn't try to open external URLs
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Sample mock event returned by backend
const mockUserEvents = [
  {
    event: {
      id: 101,
      title: "Lakers vs Warriors",
      eventDate: "2025-12-12",
      eventTime: "19:00:00",
      venueName: "Crypto.com Arena",
      venueCity: "Los Angeles",
      venueState: "CA",
      venueCountry: "USA",
      eventUrl: "https://nba.com",
      imageUrl: "https://placehold.co/400x200",
    },
  },
];

describe("BookedEventsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // First fetch → /api/users/profile
    // Second fetch → /api/user-events/:id
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.toString().includes("/api/users/profile")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ userId: 10 }),
        });
      }
      if (url.toString().includes("/api/user-events/10")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserEvents),
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  it("renders the booked events title", async () => {
    render(<BookedEventsPage />);

    expect(screen.getByText("My Booked Events")).toBeTruthy();
  });

  it("displays fetched booked events from backend", async () => {
    render(<BookedEventsPage />);

    // Wait for event title to appear after mocked fetch resolves
    await waitFor(() => {
      expect(screen.getByText("Lakers vs Warriors")).toBeTruthy();
    });

    expect(screen.getByText("2025-12-12 19:00:00")).toBeTruthy();
    expect(screen.getByText("Crypto.com Arena: Los Angeles CA USA")).toBeTruthy();
  });
});