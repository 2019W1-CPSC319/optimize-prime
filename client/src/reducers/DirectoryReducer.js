/* eslint-disable prefer-object-spread */
const initialState = {
  loading: false,
  candidates: [],
  interviewers: [],
};

const DirectoryReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ADD_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[action.role].push(action.user);
      return newState;
    case 'GET_USERS_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[action.role] = action.users;
      return newState;
    case 'DELETE_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[action.role] = newState[action.role].filter((user) => user.id !== action.userId);
      return newState;
    case 'FETCH_CANDIDATES_SUCCESS':
      // TODO: delete this
      return {
        ...state,
        candidates: action.payload,
        loading: false,
        success: false,
      };
    case 'SEND_AVAILABILITY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
      };
    default:
      return state;
  }
};

export default DirectoryReducer;
