import MeasureView from './MeasureView';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({
  ItemMetadataSnippet: () => <div>test</div>,
  CaseStudyExplorer: () => <div>test</div>,
}));

describe('MeasureView', () => {
  const mockContent = {
    '@type': 'test',
    title: 'Test Measure',
    measure_summary: {
      data: `<div class="field__item"><p>Test Data</p>
      <p>Test measure summary</p>
      </div>`,
    },
    items: [
      { '@type': 'File', '@id': 'testid' },
      { '@type': 'Image', '@id': 'testid', description: '' },
      { '@type': 'Image', '@id': 'testid', description: 'http://test' },
    ],
    ecosystem_services: [
      { code: 'test code', level: 'test level', name: 'test name' },
    ],
    biophysical_impacts: [
      { code: 'test code', level: 'test level', name: 'test name' },
    ],
    policy_objectives: [
      { code: 'test code', level: 'test level', name: 'test name' },
    ],
    measure_code: '123',
    measure_sector: 'Test Sector',
    other_sector: 'Other Sector',
    possible_benefits: {
      data: `<div class="field__items">
      <div class="field__item">
      <div class="table-responsive">
      <table class="paragraphs-table table table-striped" data-striping="1" id="paragraph-nwrm_benefits_w_level">
      <thead class="">
      <tr>
      <th><em class="placeholder">Benefits</em></th>
      <th><em class="placeholder">Level</em></th>
      </tr>
      </thead>
      <tbody>
      <tr class="odd" data-id="1273" data-quickedit-entity-id="paragraph/1273" data-type="paragraph">
      <td>
      <div class="field field--name-field-nwrm-benefits-2 field--type-entity-reference field--label-hidden field__item">BP2 - Slow runoff</div>
      </td>
      <td>
      <div class="field field--name-field-level field--type-list-string field--label-hidden field__item">High</div>
      </td>
      </tr>
      <tr class="even" data-id="18" data-quickedit-entity-id="paragraph/18" data-type="paragraph">
      <td>
      <div class="field field--name-field-nwrm-benefits-2 field--type-entity-reference field--label-hidden field__item">BP5 - Increase evapotranspiration</div>
      </td>
      <td>
      <div class="field field--name-field-level field--type-list-string field--label-hidden field__item">Medium</div>
      </td>
      </tr>
      </tbody>
      </table>
      </div></div>
      </div>`,
    },
    case_studies: [
      { '@id': '/case-study/1', title: 'Case Study 1' },
      { '@id': '/case-study/2', title: 'Case Study 2' },
    ],
  };

  it('should render the component', () => {
    const { container, getByText } = render(
      <MeasureView content={mockContent} id={'general'} />,
    );

    // Basic content
    expect(getByText('Test Measure')).toBeInTheDocument();
    expect(getByText('Test measure summary')).toBeInTheDocument();
    expect(container.querySelector('.image-wrapper')).toBeInTheDocument();

    // Related case studies
    expect(getByText('Related case studies')).toBeInTheDocument();
    expect(getByText('Case Study 1')).toBeInTheDocument();
    expect(getByText('Case Study 2')).toBeInTheDocument();
  });
});
