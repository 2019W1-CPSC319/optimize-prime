/* eslint-disable prefer-object-spread */
const initialState = {
  loading: false,
  candidates: [],
  interviewers: [],
};

const DirectoryReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case 'ADD_USER_REQUEST':
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
    default:
      return state;
  }
};

export default DirectoryReducer;
