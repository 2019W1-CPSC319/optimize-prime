import axios from "axios"

// helper functions to keep the data types in the components consistent
export const getState = (globalState) => globalState.user
export const getUserProfile = state => {
  console.log(getState(state).profile)
  return getState(state).profile || null
}

export const isLoading = (state) => !!getState(state).loading


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
    payload: true
  }
}

function fetchUserSuccess(userProfile) {
  return {
    type: 'FETCH_USER_SUCCESS',
    payload: userProfile
  }
}

function fetchUserFailure(error) {
  return {
    type: "FETCH_USER_FAILURE",
    payload: error
  };
};


export const fetchUser = () => async dispatch => {
  try{
    dispatch(initRequest())
    const response = await axios.get('/user/profile');
    const profile = response.data;

    return dispatch({
      type: 'FETCH_USER_SUCCESS',
      payload: profile
    });
  } catch(error) {
    return dispatch({
      type: 'FETCH_USER_FAILURE',
      payload: error
    });
  };
};