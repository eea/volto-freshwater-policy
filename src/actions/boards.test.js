import { getBookmark, addBookmark, modifyBookmark } from './boards';
import {
  GET_BOOKMARK,
  ADD_BOOKMARK,
  PUT_BOOKMARK,
} from '@eeacms/volto-freshwater-policy/constants/ActionTypes';
import { doStringifySearchquery } from '@eeacms/volto-freshwater-policy/utils';

describe('Boards action', () => {
  describe('getBookmark', () => {
    it('should get bookmark', () => {
      const uid = '123';
      const group = 'mygroup';
      const action = getBookmark(uid, group);

      expect(action.type).toEqual(GET_BOOKMARK);
      expect(action.request.op).toEqual('get');
      expect(action.request.path).toEqual(
        `/@bookmark?uid=${uid}&group=${group}&queryparams=${doStringifySearchquery(
          '',
        )}`,
      );
    });
  });

  describe('addBookmark', () => {
    it('should adds a bookmark', () => {
      const uid = '123';
      const group = 'mygroup';
      const action = addBookmark(uid, group);

      expect(action.type).toEqual(ADD_BOOKMARK);
      expect(action.request.op).toEqual('post');
      expect(action.request.path).toEqual('/@bookmark');
      expect(action.request.data).toEqual({
        uid,
        group,
        queryparams: doStringifySearchquery(''),
        payload: '',
      });
    });
  });

  describe('modifyBookmark', () => {
    it('should modify existing bookmark', () => {
      const uid = '123';
      const group = 'mygroup';
      const action = modifyBookmark(uid, group);

      expect(action.type).toEqual(PUT_BOOKMARK);
      expect(action.request.op).toEqual('put');
      expect(action.request.path).toEqual('/@bookmark-update');
      expect(action.request.data).toEqual({
        uid,
        group,
        queryparams: doStringifySearchquery(''),
        payload: '',
      });
    });
  });
});
