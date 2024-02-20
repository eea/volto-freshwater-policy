import SourceView from './SourceView';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({
  ItemMetadataSnippet: () => <div>test</div>,
}));

describe('SourceView', () => {
  it('should match the snapshot', () => {
    const mockContent = {
      '@type': 'test',
      title: 'Case Study Test Title',
      items: [{ '@type': 'File', '@id': 'testid' }],
      measures: [{ '@id': 'testid', title: 'Measure Test Title' }],
      sources: [{ '@id': 'testid', title: 'Soruce Test Title' }],
      measure_summary: {
        data: `<div class="field__item"><p>Meadows are areas or fields whose main vegetation is grass, or other non-woody plants, used for mowing and haying.  Pastures are grassed or wooded areas, moorland or heathland, generally used for grazing. Due to their rooted soils and their permanent cover, meadows and pastures provide good conditions for the uptake and storage of water during temporary floods. They also protect water quality by trapping sediments and assimilating nutrients.</p>
      <p>The measure offers the potential for temporary flood storage, increased water retention in the landscape and runoff attenuation. Soil cover is maintained at all times with rooted vegetation, this reduces the surface flow of water and allows greater infiltration to the soil. Rates of soil erosion are considerably lower than arable land with potential benefits for water quality.</p>
      </div>`,
      },
      source_case_studies: [{ '@id': 'Case Study', title: 'Test Title' }],
      source_data: { data: `<div>hei</div>` },
    };
    const { container } = render(
      <SourceView content={mockContent} id={'general'} />,
    );
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.field__item')).toBeInTheDocument();
  });
});
