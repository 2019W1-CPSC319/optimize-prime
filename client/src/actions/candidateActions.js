/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const fetchCandidatesSuccess = (candidates) => (
  {
    type: 'FETCH_CANDIDATES_SUCCESS',
    payload: candidates,
  }
);

const fetchCandidatesFailure = (error) => (
  {
    type: 'FETCH_CANDIDATES_FAILURE',
    payload: error,
  }
);

export const fetchCandidates = () => async (dispatch) => {
  try {
    const response = await axios.get('/schedule/candidates');
    return dispatch(fetchCandidatesSuccess(response.data));
  } catch (error) {
    return dispatch(fetchCandidatesFailure(error));
  }
};

export const fetchSpecificCandidate = (id) => async (dispatch) => {
  try {
    const response = await axios({
      url: `/schedule/candidate/${id}`,
    });
    dispatch(fetchCandidatesSuccess(response.data));
  } catch (error) {
    console.log(error);
  }
};
