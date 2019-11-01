const CandidateReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_CANDIDATES_SUCCESS':
      return {
        ...state,
        candidates: action.payload,
        loading: false,
      };
    case 'FETCH_CANDIDATES_FAILURE':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default CandidateReducer;
