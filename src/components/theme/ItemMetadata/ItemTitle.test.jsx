import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';

import ItemTitle from './ItemTitle';

describe('ItemTitle', () => {
  const mockItem = {
    '@id': '/path/to/item',
    title: 'Test Item',
    source: [{ '@id': '/path/to/source' }],
  };

  const initialState = {
    userSession: {
      token: 'mockToken',
    },
  };

  const mockStore = configureMockStore();
  const store = mockStore(initialState);

  it('renders title with link when token is present', () => {
    render(
      <Provider store={store}>
        <Router>
          <ItemTitle item={mockItem} />
        </Router>
      </Provider>,
    );

    const linkElement = screen.getByRole('link', { name: 'Test Item' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/path/to/source');
  });
});
