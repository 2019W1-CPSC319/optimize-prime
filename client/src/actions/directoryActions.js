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
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.post('/schedule/newuser', user);
    const addedUser = response.data;
    return dispatch(addUserSuccess(`${role}s`, addedUser));
  } catch (error) {
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
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.get(`/schedule/${role}s`);
    const users = response.data;
    return dispatch(getUsersSuccess(`${role}s`, users));
  } catch (error) {
    return dispatch(getUsersFailure(error));
  }
};

function getUserSuccess(user) {
  return {
    type: 'GET_USER_SUCCESS',
    user,
  };
}

function getUserFailure(error) {
  return {
    type: 'GET_USER_FAILURE',
    error,
  };
}

export const getUser = (uuid) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.get(`/schedule/candidates/${uuid}`);
    // TODO: add a safety fallback if user with matching uuid not found
    const user = response.data[0];
    return dispatch(getUserSuccess(user));
  } catch (error) {
    return dispatch(getUserFailure(error));
  }
};

function deleteUserSuccess(role, userId) {
  return {
    type: 'DELETE_USER_SUCCESS',
    role,
    userId,
  };
}

function deleteUserFailure(error) {
  return {
    type: 'DELETE_USER_FAILURE',
    error,
  };
}

export const deleteUser = (role, userId) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.put(`/schedule/${role}/delete/${userId}`);
    return dispatch(deleteUserSuccess(`${role}s`, userId));
  } catch (error) {
    return dispatch(deleteUserFailure(error));
  }
};

const sendAvailabilitySuccess = (data = {}) => ({
  type: 'SEND_AVAILABILITY_SUCCESS',
  payload: data,
});

const sendAvailabilityFailure = (message) => ({
  type: 'SEND_AVIALABILITY_FAILURE',
  payload: message,
});

export const sendAvailability = (availability, uuid) => async (dispatch) => {
  try {
    const response = await axios.post('/schedule/availability', { availability, uuid });
    return dispatch(sendAvailabilitySuccess(response.data));
  } catch (error) {
    return dispatch(sendAvailabilityFailure(error.response.data.message));
  }
};
