// __tests__/EventsPage.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
// ⬇️ adjust this path to wherever your EventsPage file is
import EventsPage from '../app/(tabs)/EventsPage';

// Mock safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock themed components as plain RN components
jest.mock('@/components/themed-view', () => {
  const { View } = require('react-native');
  return { ThemedView: View };
});

jest.mock('@/components/themed-text', () => {
  const { Text } = require('react-native');
  return { ThemedText: Text };
});

// Provide a simple localStorage mock for web-style usage
beforeAll(() => {
  (global as any).localStorage = {
    getItem: jest.fn().mockReturnValue('fake-jwt'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

// Reset fetch between tests
beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      events: [
        {
          id: 'evt-1',
          name: 'Test Event One',
          localDate: '2025-12-01',
          localTime: '19:00:00',
          dateTime: '2025-12-02T03:00:00Z',
          venueName: 'Test Arena',
          venueCity: 'Test City',
          venueState: 'CA',
          venueCountry: 'US',
          minPrice: 50,
          maxPrice: 100,
          currency: 'USD',
          category: 'Sports',
          genre: 'Basketball',
          source: 'ticketmaster',
          imageUrl: 'https://example.com/image.jpg',
          url: 'https://example.com/event',
        },
      ],
    }),
  });
});

describe('EventsPage', () => {
  it('renders header and loads events from backend', async () => {
    const { getByText, queryByText } = render(<EventsPage />);

    // Header should be there immediately
    expect(getByText('Upcoming Events')).toBeTruthy();

    // After fetch resolves, our mocked event name should appear
    await waitFor(() => {
      expect(queryByText('Test Event One')).toBeTruthy();
    });
  });
});
