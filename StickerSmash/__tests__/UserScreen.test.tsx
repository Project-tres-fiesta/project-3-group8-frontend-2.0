import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import UserScreen from '../app/(tabs)/UserScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.fetch = jest.fn();
jest.mock('@react-native-async-storage/async-storage');

describe('UserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders users list', () => {
    render(<UserScreen />);
    expect(screen.getByText(/Users/i)).toBeTruthy();
  });

  it('fetches and displays users', async () => {
    const mockUsers = [
      { userId: 1, userName: 'Alice', userEmail: 'alice@example.com' },
      { userId: 2, userName: 'Bob', userEmail: 'bob@example.com' }
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers
    });

    render(<UserScreen />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('Bob')).toBeTruthy();
    });
  });

  it('handles friend request button press', async () => {
    const mockUsers = [
      { userId: 1, userName: 'Alice', userEmail: 'alice@example.com' }
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers
    });

    render(<UserScreen />);

    await waitFor(() => {
      const friendButton = screen.getByText(/Add Friend/i);
      fireEvent.press(friendButton);
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('displays search functionality', () => {
    render(<UserScreen />);
    expect(screen.getByPlaceholderText(/Search users/i)).toBeTruthy();
  });
});
