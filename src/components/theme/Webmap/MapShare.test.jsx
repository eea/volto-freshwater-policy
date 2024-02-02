import MapShare from './MapShare';
import React from 'react';
import { Provider } from 'react-intl-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

test('renders map component', () => {
  const store = mockStore({
    userSession: { token: '1234' },
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const component = renderer.create(
    <Provider store={store}>
      <MapShare data={{ url: 'https://mapurl.com' }} />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
