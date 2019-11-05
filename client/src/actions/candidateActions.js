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

const sendAvailabilitySuccess = {
    type: 'SEND_AVAILABILITY_SUCCESS'
}

export const fetchCandidates = () => async (dispatch) => {
  try {
    const response = await axios.get('/schedule/candidates');
    return dispatch(fetchCandidatesSuccess(response.data));
  } catch (error) {
    return dispatch(fetchCandidatesFailure(error));
  }
};

export const fetchSpecificCandidate = (uuid) => async (dispatch) => {
  try {
    const response = await axios({
      url: `/schedule/candidate/name/${uuid}`,
    });
    dispatch(fetchCandidatesSuccess(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const sendAvailability = (availability) => async (dispatch) => {
  try {
    let response = await axios.post('/schedule/availability', availability);
    if (response.status == 200) {
      console.log("Availablity posted successfully")
      return dispatch(sendAvailabilitySuccess);
    } else {
      console.error("Failed to post availability to endpoint, status = " + response.status)
    }
  } catch (error) {
    console.log(error);
  }
}
