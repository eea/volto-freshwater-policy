import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChemicalTableView from './SWPrioritySubstanceTableView';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      swPrioritySubstanceTableViewParams: {
        columns: [
          { field: 'chemical' },
          { field: 'level', title: 'Concentration Level' },
          { field: 'date' },
        ],
      },
    },
  }),
}));

describe('ChemicalTableView', () => {
  it('renders table headers from columns config', () => {
    render(
      <ChemicalTableView>
        <tr>
          <td>Child row content</td>
        </tr>
      </ChemicalTableView>,
    );

    expect(screen.getByText('chemical')).toBeInTheDocument();
    expect(screen.getByText('Concentration Level')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
  });

  it('renders children inside the Table.Body', () => {
    render(
      <ChemicalTableView>
        <tr data-testid="child-row">
          <td>Cell content</td>
        </tr>
      </ChemicalTableView>,
    );

    const childRow = screen.getByTestId('child-row');
    expect(childRow).toBeInTheDocument();
    expect(childRow).toHaveTextContent('Cell content');
  });
});
