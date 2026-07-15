import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import CopyrightWidget from './CopyrightWidget';
const mockStore = configureStore();

describe('renders a copyright widget component', () => {
  it('basic', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const { asFragment, container } = render(
      <Provider store={store}>
        <CopyrightWidget
          id="copyright"
          title="CopyRight"
          fieldSet="default"
          onChange={() => {}}
        />
      </Provider>,
    );

    // Some dependency versions inject an a11y live-announcer div
    // (`<div aria-atomic="true" aria-live="polite" />`) into the rendered
    // tree. It is unrelated to this widget and makes the snapshot flaky,
    // so strip it before capturing the fragment.
    container
      .querySelectorAll('div[aria-live][aria-atomic]:empty')
      .forEach((el) => el.remove());

    expect(asFragment()).toMatchSnapshot();
  });
});
