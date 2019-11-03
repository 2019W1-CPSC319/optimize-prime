/* eslint-disable prefer-object-spread */
const initialState = {
  loading: false,
  rooms: []
};

const RoomReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ADD_ROOM_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState['rooms'].push(action.room);
      return newState;
    case 'GET_ROOMS_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState.rooms = action.rooms;
      return newState;
    default:
      return state;
  }
};

export default RoomReducer;
