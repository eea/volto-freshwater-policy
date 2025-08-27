import React from 'react';
import { render, screen } from '@testing-library/react';
import GWPollutantTableView from './GWPollutantTableView';
import '@testing-library/jest-dom';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      gwPollutantTableViewParams: {
        columns: [
          { field: 'title', title: 'Pollutant' },
          { field: 'value', title: 'Value' },
          { field: 'issued' },
        ],
      },
    },
  }),
}));

describe('GWPollutantTableView', () => {
  it('renders table headers based on appConfig columns', () => {
    render(<GWPollutantTableView>Test Children</GWPollutantTableView>);

    expect(screen.getByText('Pollutant')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('issued')).toBeInTheDocument();

    expect(screen.getByText('Test Children')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(table).toHaveClass('ui celled compact table');
  });
});
