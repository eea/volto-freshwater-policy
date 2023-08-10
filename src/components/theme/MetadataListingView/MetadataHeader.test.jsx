import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import MetadataHeader from './MetadataHeader';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({
  ItemMetadata: () => <div>test</div>,
  ItemTitle: () => <div>test</div>,
  ItemMetadataSnippet: () => <div>test</div>,
}));

describe('MetadataHeader', () => {
  const mockItem = {
    id: '123',
    title: 'Test Item',
  };

  it('should render the title', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <MetadataHeader item={mockItem} />
      </Router>,
    );
    const titleElement = getByText('Test Item');
    expect(titleElement).toBeInTheDocument();
  });

  it('should open modal on click', () => {
    const history = createMemoryHistory();
    const { getByRole, getByText } = render(
      <Router history={history}>
        <MetadataHeader item={mockItem} />
      </Router>,
    );
    const titleElement = getByRole('button');

    fireEvent.click(titleElement);

    expect(getByText('Test Item')).toBeInTheDocument();
  });
});
