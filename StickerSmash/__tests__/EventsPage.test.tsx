 
 import React from 'react';
 import { render, screen } from '@testing-library/react-native';
import EventsPage from "../app/(tabs)/EventsPage";

 describe('EventsPage', () => {
   it('renders events list header', () => {
     render(
       <EventsPage />
     );
     expect(screen.getByText(/Upcoming Events/i)).toBeTruthy();
   });
 });
