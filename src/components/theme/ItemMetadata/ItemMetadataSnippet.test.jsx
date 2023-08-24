import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ItemMetadataSnippet from './ItemMetadataSnippet';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({}));

describe('ItemMetadataSnippet', () => {
  const mockItem = {
    source: [
      {
        '@type': 'type-test',
        publication_year: 'publication_year-test',
        legislative_reference: 'legislative_reference-test',
        category: 'category-test',
      },
    ],
  };

  it('should render the component', () => {
    const { container } = render(<ItemMetadataSnippet item={mockItem} />);
    expect(
      container.querySelector('.metadata-tab-section'),
    ).toBeInTheDocument();
    expect(container.querySelector('.item-snippet-type')).toBeInTheDocument();
  });
});
