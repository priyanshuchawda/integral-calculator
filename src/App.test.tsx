import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Integral Calculator', () => {
  render(<App />);
  const headerElement = screen.getByText(/Integral Calculator/i);
  expect(headerElement).toBeInTheDocument();
});
// At the top of your integrator.test.ts file
jest.mock('worker_threads', () => ({
  Worker: jest.fn()
}));