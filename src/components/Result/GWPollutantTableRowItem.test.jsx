import React from 'react';
import { render, screen } from '@testing-library/react';
import GWPollutantTableRowItem from './GWPollutantTableRowItem';
import '@testing-library/jest-dom';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      gwPollutantTableViewParams: {
        columns: [{ field: 'title' }, { field: 'value' }, { field: 'issued' }],
      },
      facets: [
        {
          label: 'Substance',
          blacklist: ['Blacklisted Pollutant'],
        },
      ],
    },
  }),
}));

describe('GWPollutantTableRowItem', () => {
  const nowISO = new Date().toISOString();

  const baseResult = {
    title: 'Pollutant A',
    value: { raw: 12345 },
    issued: { raw: nowISO },
    expires: { raw: new Date(Date.now() + 86400000).toISOString() }, // expires tomorrow
  };

  it('renders a table row with normalized values and New label if issued < 30 days ago', () => {
    render(<GWPollutantTableRowItem result={baseResult} />);

    expect(screen.getByText('Pollutant A')).toBeInTheDocument();

    expect(screen.getByText('12,345')).toBeInTheDocument();

    expect(screen.getByText('New')).toBeInTheDocument();

    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
  });

  it('renders Archived label if expires date is past', () => {
    const expiredResult = {
      ...baseResult,
      expires: { raw: new Date(Date.now() - 86400000).toISOString() },
      issued: { raw: new Date(Date.now() - 86400000 * 40).toISOString() },
    };

    render(<GWPollutantTableRowItem result={expiredResult} />);

    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('does not render anything if result.title is blacklisted', () => {
    const blacklistedResult = {
      ...baseResult,
      title: 'Blacklisted Pollutant',
    };

    const { container } = render(
      <GWPollutantTableRowItem result={blacklistedResult} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('normalizes html strings correctly', () => {
    const htmlResult = {
      title: '<b>Bold Pollutant</b>',
      value: { raw: '<i>123</i>' },
      issued: { raw: nowISO },
      expires: { raw: null },
    };

    render(<GWPollutantTableRowItem result={htmlResult} />);

    expect(screen.getByText('Bold Pollutant')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
