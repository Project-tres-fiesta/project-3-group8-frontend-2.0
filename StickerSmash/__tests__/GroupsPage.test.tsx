import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import GroupsPage from '../app/(tabs)/GroupsPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.fetch = jest.fn();
jest.mock('@react-native-async-storage/async-storage');

describe('GroupsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders groups page title', () => {
    render(<GroupsPage />);
    expect(screen.getByText(/Your Groups/i)).toBeTruthy();
  });

  it('fetches and displays groups', async () => {
    const mockGroups = [
      { groupsId: 1, groupsName: 'Test Group 1' },
      { groupsId: 2, groupsName: 'Test Group 2' }
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockGroups
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Group 1')).toBeTruthy();
      expect(screen.getByText('Test Group 2')).toBeTruthy();
    });
  });

  it('shows empty state when no groups exist', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(<GroupsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No groups/i)).toBeTruthy();
    });
  });
});
