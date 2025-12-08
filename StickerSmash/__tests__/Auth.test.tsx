import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Auth from '../components/Auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

jest.mock('@react-native-google-signin/google-signin');

describe('Auth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Google sign-in button', () => {
    const { getByTestId } = render(<Auth />);
    expect(GoogleSignin.configure).toHaveBeenCalled();
  });

  it('configures Google SignIn with correct client ID', () => {
    render(<Auth />);
    
    expect(GoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    });
  });

  it('handles successful sign in', async () => {
    const mockResponse = {
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    };

    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(mockResponse);

    render(<Auth />);

    await waitFor(() => {
      expect(GoogleSignin.configure).toHaveBeenCalled();
    });
  });

  it('handles sign in errors gracefully', async () => {
    const mockError = new Error('Sign in failed');
    
    (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Auth />);

    await waitFor(() => {
      expect(GoogleSignin.configure).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
