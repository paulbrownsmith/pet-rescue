import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pet rescue header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Missing Pet Tracker/i);
  expect(headerElement).toBeInTheDocument();
});
