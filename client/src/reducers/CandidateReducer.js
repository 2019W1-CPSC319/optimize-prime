const CandidateReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_CANDIDATES_SUCCESS':
      return {
        ...state,
        candidates: action.payload,
        loading: false,
        success: false 
      };
    case 'FETCH_CANDIDATES_FAILURE':
      return {
        ...state,
        loading: false,
        success: false 
      };
    case 'SEND_AVAILABILITY_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true
      };
    default:
      return state;
  }
};

export default CandidateReducer;
