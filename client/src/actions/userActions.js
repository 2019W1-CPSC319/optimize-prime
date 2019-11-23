import axios from 'axios';

function updateLoadingState(type) {
  return {
    type,
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
    payload: response,
  }
);

const sendEmailFailure = (error) => (
  {
    type: 'EMAIL_SEND_FAILURE',
    error,
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
    error,
  }
);

export const findAllMeetingTimes = (data) => async (dispatch) => {
  try {
    const { candidate, interviews } = data;
    const response = await axios.post('/schedule/allmeetings', { candidate, interviews });
    return dispatch(findMeetingTimesSuccess(response));
  } catch (error) {
    return dispatch(findMeetingTimesFailure(error));
  }
}

export const findMeetingTimes = (data) => async (dispatch) => {
  try {
    const {
      candidate,
      required,
      optional,
      meetingDuration,
    } = data;
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

const createEventFailure = (error) => (
  {
    type: 'CREATE_EVENT_FAILURE',
    error,
  }
);

export const createEvent = (selectedSuggestion, candidate) => async (dispatch) => {
  const { required, optional, start, end, room } = selectedSuggestion;
  const body = {
    candidate: {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
    },
    room: {
      email: room.locationEmailAddress,
      name: room.displayName,
    },
    date: {
      startTime: {
        dateTime: start,
        timeZone: 'Pacific Standard Time',
      },
      endTime: {
        dateTime: end,
        timeZone: 'Pacific Standard Time',
      },
    },
    required,
    optional,
  };
  try {
    dispatch(initRequest());
    await axios.post('/schedule/event', body);
    return dispatch(createEventSuccess());
  } catch (error) {
    return dispatch(createEventFailure(error));
  }
};

const getInterviewsSuccess = (interviews) => (
  {
    type: 'GET_INTERVIEWS_SUCCESS',
    payload: interviews,
  }
);

const getInterviewsFailure = (error) => (
  {
    type: 'GET_INTERVIEWS_FAILURE',
    error,
  }
);

export const getInterviews = () => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.get('/schedule/interviews');
    const interviews = response.data;
    return dispatch(getInterviewsSuccess(interviews));
  } catch (error) {
    console.log(error);
    return dispatch(getInterviewsFailure(error));
  }
};

const getOutlookUsersSuccess = (outlookUsers) => (
  {
    type: 'GET_OUTLOOK_USERS_SUCCESS',
    outlookUsers,
  }
);

const getOutlookUsersFailure = (error) => (
  {
    type: 'GET_OUTLOOK_USERS_FAILURE',
    error,
  }
);

export const getOutlookUsers = () => async (dispatch) => {
  try {
    dispatch(updateLoadingState('INIT_REQUEST'));
    const response = await axios.get('/schedule/outlook/users');
    const outlookUsers = response.data;
    return dispatch(getOutlookUsersSuccess(outlookUsers));
  } catch (error) {
    console.log(error);
    return dispatch(getOutlookUsersFailure(error));
  }
};
