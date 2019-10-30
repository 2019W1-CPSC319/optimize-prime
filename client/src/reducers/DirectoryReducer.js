const initialState = {
  loading: false,
  candidates: [],
  interviewers: [],
};

const DirectoryReducer = (state = initialState, action) => {
  const mutableUsers = state.candidates.slice();
  let newState = {};
  switch (action.type) {
    case 'ADD_USER_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ADD_USER_SUCCESS':
      newState = { loading: false };
      newState[action.role] = mutableUsers.push(action.user);
      return newState;
    case 'GET_USERS_SUCCESS':
      newState = { loading: false };
      newState[action.role] = action.users;
      return newState;
    default:
      return state;
  }
};

export default DirectoryReducer;
