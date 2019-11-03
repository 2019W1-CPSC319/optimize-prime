import axios from 'axios';

function updateLoadingState(type) {
  return {
    type,
  };
}

function addRoomSuccess(room) {
  return {
    type: 'ADD_ROOM_SUCCESS',
    room,
  };
}

function addRoomFailure(error) {
  return {
    type: 'ADD_ROOM_FAILURE',
    error,
  };
}

export const addRoom = (data) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.post('/schedule/room', data);
    const room = response.data;
    return dispatch(addRoomSuccess(room));
  } catch (error) {
    console.log(error);
    return dispatch(addRoomFailure(error));
  }
};

function deleteRoomSuccess(id) {
  return {
    type: 'DELETE_ROOM_SUCCESS',
    id,
  };
}

function deleteRoomFailure(error) {
  return {
    type: 'DELETE_ROOM_FAILURE',
    error,
  };
}

export const deleteRoom = (id) => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.put(`/schedule/room/${id}`);
    // const room = response.data;
    return dispatch(deleteRoomSuccess(id));
  } catch (error) {
    console.log(error);
    return dispatch(deleteRoomFailure(error));
  }
};

function getRoomsSuccess(rooms) {
  return {
    type: 'GET_ROOMS_SUCCESS',
    rooms,
  };
}

function getRoomsFailure(error) {
  return {
    type: 'GET_ROOMS_FAILURE',
    error,
  };
}

export const getRooms = () => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.get('/schedule/rooms');
    const rooms = response.data;
    return dispatch(getRoomsSuccess(rooms));
  } catch (error) {
    console.log(error);
    return dispatch(getRoomsFailure(error));
  }
};
