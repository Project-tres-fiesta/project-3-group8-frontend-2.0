import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProfilePage from '../app/(tabs)/ProfilePage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile page with user info', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
      userName: 'testuser',
      userEmail: 'test@example.com'
    }));

    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Profile/i)).toBeTruthy();
    });
  });

  it('displays user email when loaded', async () => {
    const mockUser = {
      userName: 'johndoe',
      userEmail: 'john@example.com'
    };
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeTruthy();
    });
  });

  it('handles logout action', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
      userName: 'testuser',
      userEmail: 'test@example.com'
    }));
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(<ProfilePage />);
    
    await waitFor(() => {
      const logoutButton = getByText(/Logout/i);
      fireEvent.press(logoutButton);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });
});
