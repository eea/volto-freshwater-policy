import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import { CaseStudyFilters, ActiveFilters } from './CaseStudyFilters';

describe('CaseStudyFilters', () => {
  const mockSetActiveFilters = jest.fn();
  const mockFilters = {
    sectors: { sector1: 'Sector 1', sector2: 'Sector 2' },
  };

  it('renders without crashing', () => {
    const { container } = render(
      <CaseStudyFilters
        filters={mockFilters}
        activeFilters={{ sectors: [] }}
        setActiveFilters={mockSetActiveFilters}
      />,
    );

    expect(container.querySelector('.filter-wrapper')).toBeInTheDocument();
  });
});

describe('ActiveFilters', () => {
  const mockSetActiveFilters = jest.fn();
  const mockFilters = {
    sectors: { sector1: 'Sector 1', sector2: 'Sector 2' },
  };

  it('renders without crashing', () => {
    render(
      <ActiveFilters
        filters={mockFilters}
        activeFilters={{ sectors: [] }}
        setActiveFilters={mockSetActiveFilters}
      />,
    );
  });
});
