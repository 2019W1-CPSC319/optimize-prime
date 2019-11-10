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

const sendEmailSuccess = (response) => (
  {
    type: 'EMAIL_SEND_SUCCESS',
    payload: response
  }
);

const sendEmailFailure = (error) => (
  {
    type: 'EMAIL_SEND_FAILURE',
    payload: error
  }
);

export const sendEmail = (user) => async (dispatch) => {
  try {
    dispatch(initRequest());
    const response = await axios.post('/schedule/sendemail', user);
    return dispatch(sendEmailSuccess(response));
  } catch (error) {
    return dispatch(sendEmailFailure(error));
  }
};

const findMeetingTimesSuccess = (meetingSuggestions = []) => (
  {
    type: 'FIND_MEETING_TIMES_SUCCESS',
    payload: meetingSuggestions,
  }
);

const findMeetingTimesFailure = (error) => (
  {
    type: 'FIND_MEETING_TIMES_FAILURE',
    payload: error,
  }
);

export const findMeetingTimes = (data) => async (dispatch) => {
  try {
    const { candidate, required, optional, meetingDuration } = data;
    const response = await axios.post('/schedule/meeting', {
      candidate,
      meetingDuration,
      required,
      optional,
    });
    return dispatch(findMeetingTimesSuccess(response));
  } catch (error) {
    return dispatch(findMeetingTimesFailure(error));
  }
};

const createEventSuccess = () => (
  {
    type: 'CREATE_EVENT_SUCCESS',
  }
);

export const createEvent = () => async (dispatch) => {
  try {
    dispatch(initRequest());
    await axios.post('/schedule/createevent');
    dispatch(createEventSuccess());
  } catch (error) {
    console.log(error);
  }
};
