import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { CaseStudyList } from './CaseStudyListing';

describe('CaseStudyList', () => {
  const mockSetActiveFilters = jest.fn();

  it('renders without crashing', () => {
    render(
      <CaseStudyList
        map={{}}
        activeItems={[]}
        selectedCase={null}
        onSelectedCase={mockSetActiveFilters}
        pointsSource={[]}
        searchInput={''}
      />,
    );
  });
});
