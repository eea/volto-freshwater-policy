import React from 'react';
import { render } from '@testing-library/react';
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

    const { container, getByText } = render(
      <SimpleListingView items={mockContent} isEditMode={false} />,
    );

    expect(getByText('Item 2')).toBeInTheDocument();
    mockContent.forEach((item) => {
      if (item['@type']) {
        expect(getByText(item['@type'])).toBeInTheDocument();
      }
    });

    expect(container.querySelector('.simple-listing-item')).toBeInTheDocument();
  });
});
