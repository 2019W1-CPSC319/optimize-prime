
const AuthReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: action.payload
      }
    case 'FETCH_USER_PROFILE':
      return {
        ...state,
        profile: action.payload
      }
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        loading: false,
      }
    default:
      return state;
  }
};

export default AuthReducer;
