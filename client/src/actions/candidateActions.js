/* eslint-disable import/prefer-default-export */
import axios from 'axios';

// const setCandidateLoading = (flag = true) => ({
//   type: 'INIT_CANDIDATE_REQUEST',
//   payload: flag,
// });

// const fetchCandidatesSuccess = (candidates) => (
//   {
//     type: 'FETCH_CANDIDATES_SUCCESS',
//     payload: candidates,
//   }
// );

// const fetchCandidatesFailure = (error) => (
//   {
//     type: 'FETCH_CANDIDATES_FAILURE',
//     payload: error,
//   }
// );



// export const fetchCandidates = () => async (dispatch) => {
//   try {
//     const response = await axios.get('/schedule/candidates');
//     return dispatch(fetchCandidatesSuccess(response.data));
//   } catch (error) {
//     return dispatch(fetchCandidatesFailure(error));
//   }
// };

// export const fetchSpecificCandidate = (uuid) => async (dispatch) => {
//   try {
//     // dispatch(setCandidateLoading());
//     dispatch(updateLoadingState('INIT_REQUEST'));
//     const response = await axios({
//       url: `/schedule/candidate/name/${uuid}`,
//     });
//     dispatch(fetchCandidatesSuccess(response.data));
//   } catch (error) {
//     console.log(error);
//   }
// };

const sendAvailabilitySuccess = (data = {}) => ({
  type: 'SEND_AVAILABILITY_SUCCESS',
  payload: data
});

const sendAvailabilityFailure = (message) => ({
  type: 'SEND_AVIALABILITY_FAILURE',
  payload: message,
});

export const sendAvailability = (availability, uuid) => async (dispatch) => {
  try {
    const response = await axios.post('/schedule/availability', { availability, uuid });
    // if (response.status === 200) {
    //   console.log('Availablity posted successfully');
    //   return dispatch(sendAvailabilitySuccess());
    // }
    return dispatch(sendAvailabilitySuccess(response.data));
  } catch (error) {
    return dispatch(sendAvailabilityFailure(error.response.data.message));
  }
};
