import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NWRMBenefitsTable from './View';

jest.mock('superagent', () => ({
  get: jest.fn(() => ({
    set: jest.fn().mockResolvedValue({
      text: JSON.stringify(mockBenefitsData),
    }),
  })),
}));

jest.mock('@plone/volto/helpers', () => ({
  addAppURL: jest.fn((url) => `/mocked${url}`),
}));

const mockBenefitsData = [
  {
    sector: 'agriculture',
    code: '01',
    title: 'Test measure',
    ecosystem_services: [
      ['1', 'Provisioning', 'High'],
      ['2', 'Regulatory', 'Low'],
    ],
  },
  {
    sector: 'energy',
    code: '02',
    title: 'Other measure',
    ecosystem_services: [
      ['1', 'Provisioning', 'Medium'],
      ['3', 'Cultural', 'Negative'],
    ],
  },
];

describe('NWRMBenefitsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a table with rows and columns from fetched data', async () => {
    require('superagent').get.mockReturnValueOnce({
      set: jest.fn().mockResolvedValue({
        text: JSON.stringify(mockBenefitsData),
      }),
    });

    render(
      <NWRMBenefitsTable
        data={{
          sector: 'agriculture',
          benefit: 'ecosystem_services',
          variation: 'circle',
        }}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    expect(screen.getByText('01 - Test measure')).toBeInTheDocument();
    expect(screen.getByText('1 - Provisioning')).toBeInTheDocument();
    expect(screen.getByText('2 - Regulatory')).toBeInTheDocument();

    const highCircles = screen
      .getAllByRole('cell')
      .flatMap((cell) => cell.querySelectorAll('.circle.High'));
    expect(highCircles.length).toBeGreaterThan(0);
  });

  it('renders numeric cells instead of circles when variation is not "circle"', async () => {
    require('superagent').get.mockReturnValueOnce({
      set: jest.fn().mockResolvedValue({
        text: JSON.stringify(mockBenefitsData),
      }),
    });

    render(
      <NWRMBenefitsTable
        data={{
          sector: 'agriculture',
          benefit: 'ecosystem_services',
          variation: 'color',
        }}
      />,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

    expect(
      screen.getAllByRole('cell').some((td) => td.classList.contains('High')),
    ).toBe(true);
  });
});
