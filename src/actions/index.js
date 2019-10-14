function loginUserSuccess(user) {
  return {
    type: 'LOGIN_USER_SUCCESS',
    user,
  };
}

function loginUserFailure(error) {
  return {
    type: 'LOGIN_USER_FAILURE',
    error,
  };
}

export function loginUser(user) {
  return (dispatch) => {
    // Example:
    // if (error) {
    //   dispatch(loginUserFailure(error));
    // } else {
    //   dispatch(loginUserSuccess(user));
    // }
  };
}
