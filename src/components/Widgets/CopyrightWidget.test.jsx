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

    const { asFragment } = render(
      <Provider store={store}>
        <CopyrightWidget
          id="copyright"
          title="CopyRight"
          fieldSet="default"
          onChange={() => {}}
        />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
