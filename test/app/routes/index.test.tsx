import Index from '../../../app/routes/index';
import { render, screen } from '@testing-library/react';

test('renders placeholder index page', () => {
  render(<Index />);

  expect(
    screen.getByRole('heading', { name: 'Welcome to Remix' })
  ).toBeInTheDocument();
});
