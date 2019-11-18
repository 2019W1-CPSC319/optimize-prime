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
    payload: error,
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

const findAllMeetingTimesSuccess = (meetingSuggestions = []) => (
  {
    type: 'FIND_ALL_MEETING_TIMES_SUCCESS',
    payload: meetingSuggestions,
  }
);

const findAllMeetingTimesFailure = (error) => (
  {
    type: 'FIND_ALL_MEETING_TIMES_FAILURE',
    payload: error,
  }
);

export const findAllMeetingTimes = (data) => async (dispatch) => {
  try {
    const { candidate, interviews } = data;
    const response = await axios.post('/schedule/allmeetings', { candidate, interviews });
    console.log(response);
    return dispatch(findAllMeetingTimesSuccess(response));
  } catch (error) {
    return dispatch(findAllMeetingTimesFailure(error));
  }
};

const findMeetingTimesSuccess = (candidate, meetingSuggestions = []) => (
  {
    type: 'FIND_MEETING_TIMES_SUCCESS',
    candidateEmail: candidate,
    interviews: meetingSuggestions,
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
    const { candidate, interviews } = data;
    const response = await axios.post('/schedule/meeting', { candidate, interviews });
    console.log(response);
    return dispatch(findMeetingTimesSuccess(candidate, response.data));
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
    payload: error,
  }
);

export const createEvent = (selectedSuggestion, candidate, required, optional) => async (dispatch) => {
  const body = {
    candidate: {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
    },
    room: {
      email: selectedSuggestion.room.locationEmailAddress,
      name: selectedSuggestion.room.displayName,
    },
    date: {
      startTime: selectedSuggestion.start,
      endTime: selectedSuggestion.end,
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
    payload: error,
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
