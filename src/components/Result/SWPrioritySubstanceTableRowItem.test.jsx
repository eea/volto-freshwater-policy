import React from 'react';
import { render, screen } from '@testing-library/react';
import SWPrioritySubstanceTableRowItem from './SWPrioritySubstanceTableRowItem';
import '@testing-library/jest-dom';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      swPrioritySubstanceTableViewParams: {
        columns: [
          { field: 'title' },
          { field: 'concentration' },
          { field: 'issued' },
        ],
      },
    },
  }),
}));

describe('SWPrioritySubstanceTableRowItem', () => {
  const now = Date.now();

  const baseResult = {
    title: { raw: 'Substance A' },
    concentration: { raw: 6789 },
    issued: { raw: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() }, // 5 days ago
  };

  it('renders normalized cells with "New" label if issued < 30 days ago', () => {
    render(<SWPrioritySubstanceTableRowItem result={baseResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Substance A');
    expect(cells[0]).toHaveTextContent('New');

    expect(cells[1]).toHaveTextContent('6,789');

    expect(cells[2]).toHaveTextContent(baseResult.issued.raw);
  });

  it('renders "Archived" label if expires date is in the past', () => {
    const expiredResult = {
      ...baseResult,
      expires: { raw: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
      issued: { raw: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString() }, // 40 days ago
    };

    render(<SWPrioritySubstanceTableRowItem result={expiredResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Archived');
    expect(cells[0]).not.toHaveTextContent('New');
  });

  it('does not render "New" or "Archived" label if conditions not met', () => {
    const normalResult = {
      ...baseResult,
      expires: { raw: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString() }, // expires in future
      issued: { raw: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString() }, // issued 40 days ago
    };

    render(<SWPrioritySubstanceTableRowItem result={normalResult} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).not.toHaveTextContent('New');
    expect(cells[0]).not.toHaveTextContent('Archived');
  });

  it('normalizes HTML in the cells', () => {
    const htmlResult = {
      title: { raw: '<i>Italic Title</i>&amp;' },
      concentration: { raw: ['z', 'a', 'b'] },
      issued: { raw: '2025-12-12' },
    };
    render(<SWPrioritySubstanceTableRowItem result={htmlResult} />);

    const cells = screen.getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('Italic Title&');
    expect(cells[1]).toHaveTextContent('a, b, z');
  });
});
