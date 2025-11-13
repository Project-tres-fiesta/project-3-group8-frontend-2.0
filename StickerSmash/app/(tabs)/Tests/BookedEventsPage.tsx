import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BookedEventsPage from './BookedEventsPage';

describe('BookedEventsPage', () => {
  it('renders booked events header', () => {
    render(<BookedEventsPage />);
    expect(screen.getByText(/Your Booked Events/i)).toBeTruthy();
  });
});
