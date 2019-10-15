const AuthReducer = (user = null, action) => {
  switch (action.type) {
    case 'LOGIN_USER_SUCCESS':
      return action.user;
    default:
      return user;
  }
};

export default AuthReducer;
