import React from 'react';
import { render, screen } from '@testing-library/react';
import SWFailingRBSPTableRowItem from './SWFailingRBSPTableRowItem';
import '@testing-library/jest-dom';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      swFailingRBSPTableViewParams: {
        columns: [{ field: 'title' }, { field: 'value' }, { field: 'issued' }],
      },
    },
  }),
}));

describe('SWFailingRBSPTableRowItem', () => {
  const now = Date.now();

  const baseResult = {
    title: { raw: 'Pollutant A' },
    value: { raw: 12345 },
    issued: { raw: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() }, // 10 days ago
  };

  it('renders table cells with correct normalized content and "New" label for recent item', () => {
    render(<SWFailingRBSPTableRowItem result={baseResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Pollutant A');
    expect(cells[0]).toHaveTextContent('New');

    expect(cells[1]).toHaveTextContent('12,345');
    expect(cells[2]).toHaveTextContent(baseResult.issued.raw);
  });

  it('renders "Archived" label if expires date is in the past', () => {
    const expiredResult = {
      ...baseResult,
      expires: { raw: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
      issued: { raw: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString() }, // 40 days ago
    };

    render(<SWFailingRBSPTableRowItem result={expiredResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Archived');

    expect(cells[0]).not.toHaveTextContent('New');
  });

  it('does not render New or Archived labels if not recent and not expired', () => {
    const normalResult = {
      ...baseResult,
      expires: { raw: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString() }, // 10 days in future
      issued: { raw: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString() }, // 40 days ago
    };

    render(<SWFailingRBSPTableRowItem result={normalResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).not.toHaveTextContent('New');
    expect(cells[0]).not.toHaveTextContent('Archived');
  });

  it('normalizes HTML entities and tags in the cell content', () => {
    const htmlResult = {
      title: { raw: '<b>Bold Title</b>&amp;' },
      value: { raw: ['z', 'a', 'm'] },
      issued: { raw: '2025-01-01' },
    };
    render(<SWFailingRBSPTableRowItem result={htmlResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Bold Title&');
    expect(cells[1]).toHaveTextContent('a, m, z');
  });
});
