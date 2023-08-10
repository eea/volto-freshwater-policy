import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CaseStudyView from './CaseStudyView';

describe('CaseStudy', () => {
  it('should match the snapshot', () => {
    const { container, getByText } = render(
      <CaseStudyView
        content={{
          title: 'Case Study Test Title',
          items: [{ '@type': 'File', '@id': 'testid' }],
          measures: [{ '@id': 'testid', title: 'Measure Test Title' }],
          sources: [{ '@id': 'testid', title: 'Soruce Test Title' }],
          general: {
            data: `<div class="details-wrapper">
          <div class="field field--name-field-nwrm-cs-national-id field--type-string field--label-inline">
          <div class="field__label">National Id</div>
          <div class="field__item">Test Id</div>
          </div>
          <div class="field field--name-field-nwrm-cs-site-name field--type-string field--label-inline">
          <div class="field__label">Site name</div>
          <div class="field__item">Test Site</div>
          </div>
          <div class="field field--name-field-nwrm-cs-summary field--type-string-long field--label-above">
          <div class="field__label">Summary</div>
          <div class="field__item">Test Summary</div>
          </div>

          <div class="field field--name-field-nwrm-cs-nuts-code field--type-list-string field--label-inline">
          <div class="field__label">NUTS Code</div>
          <div class="field__item">Test Code</div>
          </div>
          <div class="field field--name-field-nwrm-cs-rbd-code field--type-string field--label-inline">
          <div class="field__label">RBD code</div>
          <div class="field__item">Test Code</div>
          </div>
          <div class="field field--name-field-nwrm-cs-transboundary field--type-boolean field--label-inline">
          <div class="field__label">Transboundary</div>
          <div class="field__item">0</div>
          </div>
          
          
          <div class="field field--name-field-nwrm-cs-longitude field--type-string field--label-inline">
          <div class="field__label">Longitude</div>
          <div class="field__item">Longitude</div>
          </div>
          <div class="field field--name-field-nwrm-cs-latitude field--type-string field--label-inline">
          <div class="field__label">Latitude</div>
          <div class="field__item">Latitude</div>
          </div>
          </div>`,
          },
        }}
        id={'general'}
      />,
    );
    expect(container.querySelector('.field__item')).toBeInTheDocument();
    expect(container.querySelector('.header-title-info')).toBeInTheDocument();
    expect(container.querySelector('.field--label-inline')).toBeInTheDocument();
    expect(container.querySelector('.field__label')).toBeInTheDocument();
    expect(container.querySelector('.accordion')).toBeInTheDocument();
    const firstItem = getByText('Sources');
    fireEvent.click(firstItem);
    fireEvent.click(firstItem);
    const secondItem = getByText('Performance');
    fireEvent.click(secondItem);
  });
});
