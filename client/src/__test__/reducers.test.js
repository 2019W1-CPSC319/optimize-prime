import { createStore } from 'redux';
import {
  ADD_ROOM_SUCCESS,
  ADD_ROOM_FAILURE,
  DELETE_ROOM_SUCCESS,
  DELETE_ROOM_FAILURE,
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAILURE,
} from '../actions';
import reducers from '../reducers';

describe('redux reducers', () => {
  describe('rooms reducer', () => {
    const store = createStore(reducers).getState();

    it('returns the default state of falsy props and an empty list', () => {
      let oldState;
      const newState = store.rooms;

      expect(newState).toMatchObject({
        loading: false,
        rooms: [],
      });
    });
  });
});
