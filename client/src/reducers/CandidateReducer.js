const CandidateReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_CANDIDATE_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_CANDIDATES_SUCCESS':
      return {
        ...state,
        candidates: action.payload,
        loading: false,
        success: false,
      };
    case 'FETCH_CANDIDATES_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
      };
    case 'SEND_AVAILABILITY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
      };
    case 'SEND_AVAILABILITY_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default CandidateReducer;
