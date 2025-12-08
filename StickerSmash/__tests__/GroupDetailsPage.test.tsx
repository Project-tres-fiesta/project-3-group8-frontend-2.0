import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import GroupDetailsPage from '../app/(tabs)/GroupDetailsPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.fetch = jest.fn();
jest.mock('@react-native-async-storage/async-storage');

describe('GroupDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders group details page', () => {
    render(<GroupDetailsPage />);
    expect(screen.getByText(/Group Details/i)).toBeTruthy();
  });

  it('fetches and displays group information', async () => {
    const mockGroup = {
      groupsId: 1,
      groupsName: 'Test Group',
      groupsDescription: 'A test group'
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockGroup
    });

    render(<GroupDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeTruthy();
    });
  });

  it('displays group members', async () => {
    const mockMembers = [
      { userId: 1, userName: 'User1' },
      { userId: 2, userName: 'User2' }
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMembers
    });

    render(<GroupDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('User1')).toBeTruthy();
      expect(screen.getByText('User2')).toBeTruthy();
    });
  });
});
