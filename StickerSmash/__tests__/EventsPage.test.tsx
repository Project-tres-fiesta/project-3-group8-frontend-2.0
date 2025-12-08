import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import EventsPage from '../app/(tabs)/EventsPage';

global.fetch = jest.fn();

describe('EventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders events list header', () => {
    render(<EventsPage />);
    expect(screen.getByText(/Upcoming Events/i)).toBeTruthy();
  });

  it('fetches and displays events from API', async () => {
    const mockEvents = [
      { id: '1', name: 'Rock Concert', dates: { start: { localDate: '2025-12-20' } } }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ _embedded: { events: mockEvents } })
    });

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Rock Concert')).toBeTruthy();
    });
  });

  it('handles search input', async () => {
    render(<EventsPage />);

    const searchInput = screen.getByPlaceholderText(/Search events/i);
    fireEvent.changeText(searchInput, 'concert');

    expect(searchInput.props.value).toBe('concert');
  });

  it('displays loading state while fetching', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<EventsPage />);
    
    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });
});
