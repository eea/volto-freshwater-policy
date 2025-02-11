import MeasureView from './MeasureView';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    ecosystem_services: {
      value: [{ code: 'test code', level: 'test level', name: 'test name' }],
    },
    biophysical_impacts: {
      value: [{ code: 'test code', level: 'test level', name: 'test name' }],
    },
    policy_objectives: {
      value: [{ code: 'test code', level: 'test level2', name: 'test name' }],
    },
    measure_code: '123',
    measure_sector: 'Test Sector',
    other_sector: 'Other Sector',
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
    // expect(container.querySelector('.image-wrapper')).toBeInTheDocument();
    const accordion = container.querySelector('.accordion');
    fireEvent.click(accordion);

    // Related case studies
    expect(getByText('Related case studies')).toBeInTheDocument();
    expect(getByText('Case Study 1')).toBeInTheDocument();
    expect(getByText('Case Study 2')).toBeInTheDocument();

    // Click on the accordion title
    fireEvent.click(getByText('Policy Objectives'));
    // expect(getByText('test level2')).toBeVisible();
  });
});
