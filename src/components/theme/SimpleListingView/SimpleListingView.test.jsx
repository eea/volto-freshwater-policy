import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import SimpleListingView from './SimpleListingView';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({
  ItemMetadata: () => <div>test</div>,
  ItemTitle: () => <div>test</div>,
  ItemMetadataSnippet: () => <div>test</div>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    hash: '',
  })),
}));

describe('SimpleListingView', () => {
  it('should render a list of items', () => {
    const mockContent = [
      {
        '@id': '/item/1',
        '@type': 'Document',
      },
      {
        '@id': '/item/2',
        title: 'Item 2',
        '@type': 'File',
      },
    ];
    const history = createMemoryHistory();
    const { container, getByText } = render(
      <Router history={history}>
        <SimpleListingView items={mockContent} isEditMode={false} />
      </Router>,
    );

    expect(getByText('Item 2')).toBeInTheDocument();
    mockContent.forEach((item) => {
      if (item['@type']) {
        expect(getByText(item['@type'])).toBeInTheDocument();
      }
    });

    expect(container.querySelector('.simple-listing-item')).toBeInTheDocument();
    const itemToOpenModal = container.querySelector('.simple-listing');
    fireEvent.click(itemToOpenModal);
  });
});
