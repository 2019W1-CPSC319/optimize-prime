const InterviewerReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_INTERVIEWERS_SUCCESS':
      return {
        ...state,
        interviewers: action.payload,
        loading: false,
      };
    case 'FETCH_INTERVIEWERS_FAILURE':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default InterviewerReducer;
