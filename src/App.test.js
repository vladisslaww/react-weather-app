import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders search bar', () => {
  const { getByRole } = render(<App />);
  const searchElement = getByRole("textbox");
  expect(searchElement).toBeInTheDocument();
  expect(searchElement).toHaveClass("search-bar");
});
