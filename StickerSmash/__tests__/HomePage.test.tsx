import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomePage from '../app/(tabs)/HomePage';

describe('HomePage', () => {
  it('renders home page title', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome/i)).toBeTruthy();
  });

  it('displays app name or logo', () => {
    render(<HomePage />);
    expect(screen.getByText(/EventLink/i)).toBeTruthy();
  });

  it('renders navigation buttons', () => {
    render(<HomePage />);
    expect(screen.getByText(/Explore Events/i)).toBeTruthy();
  });

  it('shows feature highlights', () => {
    render(<HomePage />);
    expect(screen.getByText(/Discover/i)).toBeTruthy();
  });
});
