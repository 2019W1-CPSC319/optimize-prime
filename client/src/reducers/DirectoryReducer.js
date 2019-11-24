/* eslint-disable prefer-object-spread */
const initialState = {
  loading: false,
  candidates: [],
  interviewers: [],
};

const DirectoryReducer = (state = initialState, action) => {
  let newState = {};
  const { role, user } = action;
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case 'ADD_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[role].push(action.user);
      return newState;
    case 'GET_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false, user });
      return newState;
    case 'ADD_USER_FAILURE':
      return {
        ...state,
        error: action.error,
      };
    case 'EDIT_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[action.role] = newState[action.role].map((user) => {
        if (user.id === action.user.id) {
          return action.user;
        }
        return user;
      });
      return newState;
    case 'GET_USERS_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[role] = action.users;
      return newState;
    case 'GET_OUTLOOK_USERS_SUCCESS':
      const { outlookUsers } = action;
      return {
        ...state,
        interviewers: outlookUsers,
      };
    case 'GET_CANDIDATE_SUCCESS':
      const { candidate } = action;
      return {
        ...state,
        loading: false,
        candidate,
      };
    case 'DELETE_USER_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState[role] = newState[role].filter((user) => user.id !== action.userId);
      return newState;
    case 'SEND_AVAILABILITY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
      };
    case 'GET_EMAIL_TEMPLATE_SUCCESS':
      const { template } = action;
      return {
        ...state,
        template,
      };
    case 'UPDATE_EMAIL_TEMPLATE_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default DirectoryReducer;
