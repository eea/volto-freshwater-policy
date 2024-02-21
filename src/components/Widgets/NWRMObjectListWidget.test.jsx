import React from 'react';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  EcosystemServiceWidget,
  BiophysicalImpactWidget,
  PolicyObjectiveWidget,
} from './NWRMObjectListWidget';
import '@testing-library/jest-dom/extend-expect';

jest.mock('uuid', () => {
  let value = 0;
  return {
    v4: jest.fn(() => `uuid-${value++}`),
  };
});

jest.mock('@plone/volto/components/manage/DragDropList/DragDropList', () => {
  // A functional component that mocks DragDropList behavior
  return ({ children, onMoveItem, childList, onChange }) => {
    const handleMoveItem = (sourceIndex, destinationIndex) => {
      const newList = [...childList];
      const [removed] = newList.splice(sourceIndex, 1);
      newList.splice(destinationIndex, 0, removed);
      onMoveItem({
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
        draggableId: removed[0],
      });
    };
    const handleRemoveItem = (index) => {
      const newList = [...childList];
      newList.splice(index, 1); // Remove the item at the specified index
    };

    // Rendering mock draggable items and a button to simulate moving an item
    return (
      <div>
        {childList.map(([id, child], index) => (
          <div key={id}>
            {children({ child, childId: id, index, draginfo: {} })}
            {/* Button to simulate moving this item down by one position */}
            <button
              id={`move-${id}`}
              onClick={() =>
                handleMoveItem(index, Math.min(index + 1, childList.length - 1))
              }
            >
              Move {id}
            </button>
            {/* Button to simulate removing this item */}
            <button id={`remove-${id}`} onClick={() => handleRemoveItem(index)}>
              Remove {id}
            </button>
          </div>
        ))}
      </div>
    );
  };
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('EcosystemServiceWidget', () => {
  it('renders with the ecosystem schema', () => {
    const { getByText } = render(
      <Provider store={store}>
        <EcosystemServiceWidget />
      </Provider>,
    );
    expect(getByText('Add Ecosystem service')).toBeInTheDocument();
  });

  it('adds a new item when the Add button is clicked', async () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <EcosystemServiceWidget onChange={onChangeMock} />
      </Provider>,
    );
    fireEvent.click(getByText('Add Ecosystem service'));
    await waitFor(() => expect(onChangeMock).toHaveBeenCalledTimes(1));
  });

  it('removes an item when the delete icon is clicked', async () => {
    const onChangeMock = jest.fn();
    const initialValue = [{ '@id': 'item-1' }, { '@id': 'item-2' }];
    const { container } = render(
      <Provider store={store}>
        <EcosystemServiceWidget onChange={onChangeMock} value={initialValue} />
      </Provider>,
    );
    screen.debug();

    fireEvent.click(container.querySelector('#remove-item-2'));
  });

  it('removes an item when the delete icon is clicked', async () => {
    const onChangeMock = jest.fn();
    const initialValue = [{ '@id': 'item-1' }, { '@id': 'item-2' }];
    const { container } = render(
      <Provider store={store}>
        <EcosystemServiceWidget
          onChange={onChangeMock}
          value={initialValue}
          activeObject={{ '@id': 'item-1' }}
          setActiveObject={() => {}}
        />
      </Provider>,
    );
    screen.debug();

    fireEvent.click(container.querySelector('#remove-item-2'));
  });

  it('moves an item when the delete icon is clicked', async () => {
    const onChangeMock = jest.fn();
    const initialValue = [{ '@id': 'item-1' }, { '@id': 'item-2' }];
    const { container } = render(
      <Provider store={store}>
        <EcosystemServiceWidget onChange={onChangeMock} value={initialValue} />
      </Provider>,
    );
    screen.debug();

    fireEvent.click(container.querySelector('#move-item-2'));
  });
});

describe('BiophysicalImpactWidget', () => {
  it('renders with the ecosystem schema', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BiophysicalImpactWidget />
      </Provider>,
    );
    expect(getByText('Add Biophysical impact')).toBeInTheDocument();
  });
});

describe('PolicyObjectiveWidget', () => {
  it('renders with the ecosystem schema', () => {
    const { getByText } = render(
      <Provider store={store}>
        <PolicyObjectiveWidget />
      </Provider>,
    );
    expect(getByText('Add Policy objective')).toBeInTheDocument();
  });
});
