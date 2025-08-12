import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UWWTView, WRView } from './View';

jest.mock('@eeacms/volto-datablocks/Utils', () => ({
  DataConnectedValue: jest.fn(() => <span>MockedDataValue</span>),
}));

describe('UWWTView component (indirectly tests getClassNameUWWT)', () => {
  it('applies the correct CSS class for high values', () => {
    const { container } = render(
      <UWWTView provider_url="/api" column_data="test" column_value={[98]} />,
    );
    expect(container.querySelector('.uww-left')).toHaveClass('blue-bg');
  });

  it('applies the correct CSS class for mid-range values', () => {
    const { container } = render(
      <UWWTView provider_url="/api" column_data="test" column_value={[80]} />,
    );
    expect(container.querySelector('.uww-left')).toHaveClass('orange-bg');
  });

  it('renders DataConnectedValue when column_value[0] is not 0', () => {
    render(
      <UWWTView
        provider_url="/api"
        column_data="test"
        column_value={[85]}
        description="Test description"
      />,
    );
    expect(screen.getByText('MockedDataValue')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders "0%" when column_value[0] is 0', () => {
    render(
      <UWWTView provider_url="/api" column_data="test" column_value={[0]} />,
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});

describe('WRView component (indirectly tests getClassNameWR)', () => {
  it('applies the correct CSS class for low values', () => {
    const { container } = render(
      <WRView provider_url="/api" column_data="test" column_value={[10]} />,
    );
    expect(container.querySelector('.uww-left')).toHaveClass('blue-bg');
  });

  it('applies the correct CSS class for higher values', () => {
    const { container } = render(
      <WRView provider_url="/api" column_data="test" column_value={[50]} />,
    );
    expect(container.querySelector('.uww-left')).toHaveClass('yellow-bg');
  });

  it('renders DataConnectedValue when column_value[0] is not 0', () => {
    render(
      <WRView
        provider_url="/api"
        column_data="test"
        column_value={[15]}
        description="Water scarcity"
      />,
    );
    expect(screen.getByText('MockedDataValue')).toBeInTheDocument();
    expect(screen.getByText('Water scarcity')).toBeInTheDocument();
  });

  it('renders "0%" when column_value[0] is 0', () => {
    render(
      <WRView provider_url="/api" column_data="test" column_value={[0]} />,
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
