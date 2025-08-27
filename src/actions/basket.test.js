import { addItemToBasket, removeItemFromBasket } from './basket';

import {
  ADD_TO_BASKET,
  REMOVE_FROM_BASKET,
} from '@eeacms/volto-freshwater-policy/constants/ActionTypes';

describe('basket actions', () => {
  describe('addItemToBasket', () => {
    it('should create an action to add an item to the basket', () => {
      const item = { id: 1, name: 'Test Item' };
      const expectedAction = {
        type: ADD_TO_BASKET,
        payload: item,
      };
      expect(addItemToBasket(item)).toEqual(expectedAction);
    });
  });

  describe('removeItemFromBasket', () => {
    it('should create an action to remove an item from the basket', () => {
      const item = { id: 2, name: 'Another Item' };
      const expectedAction = {
        type: REMOVE_FROM_BASKET,
        payload: item,
      };
      expect(removeItemFromBasket(item)).toEqual(expectedAction);
    });
  });
});
