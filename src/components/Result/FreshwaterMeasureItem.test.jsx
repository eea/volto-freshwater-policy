import React from 'react';
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import FreshwaterMeasureItem from './FreshwaterMeasureItem';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      vocab: { cluster_name: { someTerm: 'Display Value' } },
    },
  }),
}));

jest.mock(
  '@eeacms/search/components/Result/ExternalLink',
  () =>
    ({ href, children, title }) => (
      <a href={href} title={title}>
        {children}
      </a>
    ),
);

jest.mock('@eeacms/search', () => ({
  SegmentedBreadcrumb: ({ href }) => (
    <div data-testid="segmented-breadcrumb">Breadcrumb: {href}</div>
  ),
  StringList: ({ value }) => <div data-testid="string-list">List: {value}</div>,
  ResultContext: () => <div data-testid="result-context">Result Context</div>,
}));

jest.mock('@eeacms/volto-listing-block', () => ({
  UniversalCard: ({ item }) => (
    <div data-testid="universal-card">
      <div data-testid="title">{item.title}</div>
      <div data-testid="description">{item.description}</div>
      <div data-testid="extra">{item.extra}</div>
    </div>
  ),
}));

jest.mock('@eeacms/search/lib/utils', () => ({
  firstWords: (text, count) => text.split(' ').slice(0, count).join(' '),
  getTermDisplayValue: ({ vocab, field, term }) => vocab[field]?.[term] || term,
}));

describe('FreshwaterMeasureItem', () => {
  const baseResult = {
    href: 'http://example.com/item/1',
    title: 'Test Item',
    source: 'someTerm',
    measure_sector: { raw: 'Sector1, Sector2' },
    hasImage: true,
    thumbUrl: 'http://example.com/thumb.jpg',
    isExpired: true,
  };

  it('renders with basic props', () => {
    render(<FreshwaterMeasureItem result={baseResult} />);

    expect(screen.getByTestId('title')).toHaveTextContent('Test Item');

    expect(screen.getByText('Archived')).toBeInTheDocument();

    expect(screen.getByTestId('extra')).toBeInTheDocument();

    expect(screen.getByTestId('string-list')).toHaveTextContent(
      'Sector1, Sector2',
    );

    expect(screen.getByTestId('segmented-breadcrumb')).toHaveTextContent(
      baseResult.href,
    );
  });

  it('renders description with children when passed', () => {
    render(
      <FreshwaterMeasureItem result={baseResult}>
        <div data-testid="child-desc">Custom Description</div>
      </FreshwaterMeasureItem>,
    );

    expect(screen.getByTestId('description')).toContainElement(
      screen.getByTestId('child-desc'),
    );
  });
});
