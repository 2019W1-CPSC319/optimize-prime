import axios from 'axios';

function updateLoadingState(type) {
  return {
    type,
  };
}

function addUserSuccess(role, user) {
  return {
    type: 'ADD_USER_SUCCESS',
    role,
    user,
  };
}

function addUserFailure(error) {
  return {
    type: 'ADD_USER_FAILURE',
    error,
  };
}

export const addUser = (role, user) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('ADD_USER_REQUEST'));
    const response = await axios.post('/schedule/newuser', user);
    const addedUser = response.data;
    return dispatch(addUserSuccess(`${role}s`, addedUser));
  } catch (error) {
    console.log(error);
    return dispatch(addUserFailure(error));
  }
};

function getUsersSuccess(role, users) {
  return {
    type: 'GET_USERS_SUCCESS',
    role,
    users,
  };
}

function getUsersFailure(error) {
  return {
    type: 'GET_USERS_FAILURE',
    error,
  };
}

export const getUsers = (role) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('GET_USERS_REQUEST'));
    const response = await axios.get(`/schedule/${role}s`);
    const users = response.data;
    return dispatch(getUsersSuccess(`${role}s`, users));
  } catch (error) {
    console.log(error);
    return dispatch(getUsersFailure(error));
  }
};
