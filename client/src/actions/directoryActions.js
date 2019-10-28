import axios from 'axios';

function updateLoadingState(type) {
  return {
    type,
  };
}

function addUserSuccess(user) {
  return {
    type: 'ADD_USER_SUCCESS',
    user,
  };
}

function addUserFailure(error) {
  return {
    type: 'ADD_USER_FAILURE',
    error,
  };
}

export const addUser = (user) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('ADD_USER_REQUEST'));
    const response = await axios.post('/users', user);
    const addedUser = response.data;
    return dispatch(addUserSuccess(addedUser));
  } catch (error) {
    console.log(error);
    return dispatch(addUserFailure(error));
  }
};

function getUsersSuccess(users) {
  return {
    type: 'GET_USERS_SUCCESS',
    users,
  };
}

function getUsersFailure(error) {
  return {
    type: 'GET_USERS_FAILURE',
    error,
  };
}

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(updateLoadingState('GET_USERS_REQUEST'));
    const response = await axios.get('/users');
    const users = response.data;
    return dispatch(getUsersSuccess(users));
  } catch (error) {
    console.log(error);
    return dispatch(getUsersFailure(error));
  }
};
