import axios from 'axios';

const fetchInterviewersSuccess = (candidates) => (
  {
    type: 'FETCH_INTERVIEWERS_SUCCESS',
    payload: candidates,
  }
);

const fetchInterviewerFailure = (error) => (
  {
    type: 'FETCH_INTERVIEWERS_FAILURE',
    payload: error,
  }
);

// eslint-disable-next-line import/prefer-default-export
export const fetchInterviewers = () => async (dispatch) => {
  try {
    const response = await axios.get('/schedule/interviewers');
    return dispatch(fetchInterviewersSuccess(response.data));
  } catch (error) {
    return dispatch(fetchInterviewerFailure(error));
  }
};
