/* eslint-disable prefer-object-spread */
const AuthReducer = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: action.payload,
      };
    case 'FETCH_USER_PROFILE':
      return {
        ...state,
        profile: action.payload,
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        hasTriedLogin: true,
      };
    case 'FETCH_USER_FAILURE':
      return {
        ...state,
        loading: false,
        hasTriedLogin: true,
      };
    case 'CREATE_EVENT_SUCCESS':
      newState = Object.assign({}, state, { loading: false });
      newState.interviews.push(action.interview);
      return newState;
    case 'GET_INTERVIEWS_SUCCESS':
      return {
        ...state,
        loading: false,
        interviews: action.payload,
      };
    case 'FIND_MEETING_TIMES_SUCCESS':
      return {
        ...state,
        loading: false,
        meetingSuggestions: action.interviews,
      };
    case 'FIND_ALL_MEETING_TIMES_SUCCESS':
      return {
        ...state,
        loading: false,
        meetingSuggestions: action.payload,
      };
    case 'EMAIL_SEND_SUCCESS':
      return {
        ...state,
        loading: false,
        status: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
