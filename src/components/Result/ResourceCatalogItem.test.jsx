import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourceCatalogItem from './ResourceCatalogItem';
import '@testing-library/jest-dom';

jest.mock('@eeacms/search/lib/hocs', () => ({
  useAppConfig: () => ({
    appConfig: {
      vocab: {
        cluster_name: {
          sourceTerm: 'Display Source',
        },
      },
    },
    registry: {
      resolve: {
        UniversalCard: {
          component: ({ item }) => (
            <div data-testid="universal-card">
              <div data-testid="title">{item.title}</div>
              <div data-testid="meta">{item.meta}</div>
              <div data-testid="description">{item.description}</div>
              <div data-testid="preview-image">{item.preview_image_url}</div>
              <div data-testid="extra">{item.extra}</div>
            </div>
          ),
        },
      },
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

jest.mock('@eeacms/search/components', () => ({
  SegmentedBreadcrumb: ({ href }) => (
    <div data-testid="segmented-breadcrumb">Breadcrumb: {href}</div>
  ),
  StringList: ({ value }) => (
    <div data-testid="string-list">
      List: {value?.join ? value.join(', ') : value}
    </div>
  ),
  DateTime: ({ value }) => <time dateTime={value}>{value}</time>,
}));

jest.mock('@eeacms/search/lib/utils', () => ({
  firstWords: (text, count) =>
    typeof text === 'string' ? text.split(' ').slice(0, count).join(' ') : text,
  getTermDisplayValue: ({ vocab, field, term }) => vocab[field]?.[term] || term,
}));

jest.mock('@eeacms/search/components/Result/ResultContext', () => (props) => (
  <div data-testid="result-context">ResultContext</div>
));

jest.mock(
  '@eeacms/search/components/Result/ContentClusters',
  () =>
    ({ clusters, item }) => (
      <div data-testid="content-clusters">ContentClusters</div>
    ),
);

describe('ResourceCatalogItem', () => {
  const baseResult = {
    href: 'http://example.com/resource/1',
    title: 'Resource Title',
    source: 'sourceTerm',
    clusterInfo: ['cluster1', 'cluster2'],
    hasImage: true,
    thumbUrl: 'http://example.com/thumb.jpg',
    isNew: true,
    isExpired: false,
    _result: {
      category: {
        raw: ['Topic1', 'Topic2'],
      },
    },
    issued: '2025-01-01T12:00:00Z',
  };

  it('renders correctly with all props', () => {
    render(<ResourceCatalogItem result={baseResult} />);

    expect(screen.getByTestId('title')).toHaveTextContent('Resource Title');
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();

    expect(screen.getByTestId('meta')).toHaveTextContent('ContentClusters');

    expect(screen.getByTestId('description')).toHaveTextContent(
      'ResultContext',
    );

    expect(screen.getByTestId('preview-image')).toHaveTextContent(
      baseResult.thumbUrl,
    );

    const extra = screen.getByTestId('extra');
    expect(extra).toHaveTextContent('2025-01-01T12:00:00Z');
    expect(extra).toHaveTextContent('Topic1, Topic2');
    expect(extra).toHaveTextContent('Display Source');

    expect(screen.getByTestId('segmented-breadcrumb')).toHaveTextContent(
      baseResult.href,
    );
  });

  it('renders Archived label when isExpired is true', () => {
    render(
      <ResourceCatalogItem
        result={{ ...baseResult, isNew: false, isExpired: true }}
      />,
    );
    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('renders children as description if passed', () => {
    render(
      <ResourceCatalogItem result={baseResult}>
        <div data-testid="custom-desc">Custom Description</div>
      </ResourceCatalogItem>,
    );

    expect(screen.getByTestId('description')).toContainElement(
      screen.getByTestId('custom-desc'),
    );
  });
});
