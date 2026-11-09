import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { PageBannerActionsView } from './PageBannerActionsView';

const renderActions = (data = {}) => {
  const store = createStore((state = { content: { data: {} } }) => state);
  const intl = { formatMessage: (message) => message.defaultMessage };

  return render(
    <Provider store={store}>
      <PageBannerActionsView data={data} intl={intl} />
    </Provider>,
  );
};

describe('PageBannerActionsView', () => {
  it('renders the share and download actions by default', () => {
    renderActions();

    expect(screen.getByTitle('Share')).toBeInTheDocument();
    expect(screen.getByTitle('Download')).toBeInTheDocument();
  });

  it('can hide each action', () => {
    renderActions({ hideShareButton: true, hideDownloadButton: true });

    expect(screen.queryByTitle('Share')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Download')).not.toBeInTheDocument();
  });
});
