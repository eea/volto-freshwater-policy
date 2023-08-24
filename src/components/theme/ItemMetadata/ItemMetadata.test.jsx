import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ItemMetadata from './ItemMetadata';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({}));

describe('ItemMetadata', () => {
  const mockItem = {
    source: [
      {
        description: 'description-test',
        lineage: 'lineage-test',
        embed_url: 'embed_url-test',
        webmap_url: 'webmap_url-test',
        license_copyright: 'license_copyright-test',
        publisher: { title: 'title-test' },
        dpsir_type: 'dpsir_type-test',
        report_type: 'report_type-test',
        original_source: 'original_source-test',
        temporal_coverage: { temporal: ['temporal-test'] },
        geo_coverage: { geolocation: ['geolocation-test'] },
      },
    ],
  };

  it('should render the component', () => {
    const { container } = render(<ItemMetadata item={mockItem} />);
    expect(container.querySelector('.metadata-icons')).toBeInTheDocument();
  });
});
