import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChemicalTableView from './SWFailingRBSPTableView';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      swFailingRBSPTableViewParams: {
        columns: [
          { field: 'chemicalName', title: 'Chemical Name' },
          { field: 'concentration' },
          { field: 'date' },
        ],
      },
    },
  }),
}));

describe('ChemicalTableView', () => {
  it('renders table headers from appConfig columns', () => {
    render(
      <ChemicalTableView>
        <tr>
          <td>Child row</td>
        </tr>
      </ChemicalTableView>,
    );

    expect(screen.getByText('Chemical Name')).toBeInTheDocument();
    expect(screen.getByText('concentration')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
  });

  it('renders children inside the table body', () => {
    render(
      <ChemicalTableView>
        <tr data-testid="child-row">
          <td>Cell 1</td>
        </tr>
      </ChemicalTableView>,
    );

    const childRow = screen.getByTestId('child-row');
    expect(childRow).toBeInTheDocument();
    expect(childRow).toHaveTextContent('Cell 1');
  });
});
