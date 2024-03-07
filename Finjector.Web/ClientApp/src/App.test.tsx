import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeAll, afterAll } from 'vitest';

import { server } from '../test/mocks/node';

import App from './App';

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  it('shows landing page once user logged in', async () => {
    render(wrappedView());

    // should see landing page
    await waitFor(() => {
      expect(
        screen.getByText('New Chart String from Scratch'),
      ).toBeInTheDocument();
    });
  });
});

const wrappedView = () => (
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
