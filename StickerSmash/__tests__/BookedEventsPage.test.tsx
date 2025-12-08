import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import BookedEventsPage from '../app/(tabs)/BookedEventsPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.fetch = jest.fn();
jest.mock('@react-native-async-storage/async-storage');

describe('BookedEventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders booked events page header', () => {
    render(<BookedEventsPage />);
    expect(screen.getByText(/My Booked Events/i)).toBeTruthy();
  });

  it('fetches and displays booked events', async () => {
    const mockEvents = [
      { eventId: 1, title: 'Concert Event', eventDate: '2025-12-20', venueName: 'Test Arena' }
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockEvents
    });

    render(<BookedEventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Concert Event')).toBeTruthy();
    });
  });

  it('shows empty state when no events are booked', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(<BookedEventsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No events booked/i)).toBeTruthy();
    });
  });
});
