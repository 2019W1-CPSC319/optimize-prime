import axios from 'axios';

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

function initRequest() {
  return {
    type: 'INIT_REQUEST',
    payload: true,
  };
}

function fetchUserSuccess(userProfile) {
  return {
    type: 'FETCH_USER_SUCCESS',
    payload: userProfile,
  };
}

function fetchUserFailure(error) {
  return {
    type: 'FETCH_USER_FAILURE',
    payload: error,
  };
}


export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(initRequest());
    const response = await axios.get('/user/profile');
    const profile = response.data;
    return dispatch(fetchUserSuccess(profile));
  } catch (error) {
    console.log(error);
    return dispatch(fetchUserFailure(error));
  }
};
