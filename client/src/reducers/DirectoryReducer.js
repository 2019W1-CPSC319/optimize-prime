const initialState = {
  loading: false,
  users: [],
};

const DirectoryReducer = (state = initialState, action) => {
  let mutableUsers = state.users.slice();
  switch (action.type) {
    case 'ADD_USER_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ADD_USER_SUCCESS':
      mutableUsers.push(action.user);
      return {
        loading: false,
        users: mutableUsers,
      };
    case 'GET_USERS_SUCCESS':
      mutableUsers = action.users;
      return {
        loading: false,
        users: mutableUsers,
      };
    default:
      return state;
  }
};

export default DirectoryReducer;
