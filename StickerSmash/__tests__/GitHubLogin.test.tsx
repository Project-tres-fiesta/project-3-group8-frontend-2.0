import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GitHubLogin from '../components/GitHubLogin';
import * as WebBrowser from 'expo-web-browser';

jest.mock('expo-web-browser');

describe('GitHubLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders GitHub login button', () => {
    const { getByText } = render(<GitHubLogin />);
    expect(getByText(/Sign in with GitHub/i)).toBeTruthy();
  });

  it('opens browser on button press', async () => {
    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue({
      type: 'success',
      url: 'http://localhost:8080/callback?code=mockcode'
    });

    const { getByText } = render(<GitHubLogin />);
    const button = getByText(/Sign in with GitHub/i);

    fireEvent.press(button);

    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
  });

  it('handles successful GitHub auth', async () => {
    const mockResult = {
      type: 'success',
      url: 'http://localhost:8080/callback?code=test123'
    };

    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue(mockResult);

    const { getByText } = render(<GitHubLogin />);
    const button = getByText(/Sign in with GitHub/i);

    fireEvent.press(button);

    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
  });

  it('handles cancelled GitHub auth', async () => {
    const mockResult = {
      type: 'cancel'
    };

    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue(mockResult);

    const { getByText } = render(<GitHubLogin />);
    const button = getByText(/Sign in with GitHub/i);

    fireEvent.press(button);

    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
  });
});
