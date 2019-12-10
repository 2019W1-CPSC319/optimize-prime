const AuthReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...state,
        loading: action.payload,
      };
    case 'FETCH_USER_PROFILE':
      return {
        ...state,
        profile: action.payload,
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        hasTriedLogin: true,
      };
    case 'FETCH_USER_FAILURE':
      return {
        ...state,
        loading: false,
        hasTriedLogin: true,
      };
    case 'GET_INTERVIEWS_REQUEST':
      return {
        ...state,
        interviewsLoading: true,
      };
    case 'GET_INTERVIEWS_FAILURE':
      return {
        ...state,
        interviewsLoading: false,
      };
    case 'GET_INTERVIEWS_SUCCESS':
      return {
        ...state,
        interviewsLoading: false,
        interviews: action.payload,
      };
    case 'FIND_MEETING_TIMES_REQUEST':
      return {
        ...state,
        findMeetingTimesLoading: true,
      };
    case 'FIND_MEETING_TIMES_FAILURE':
      return {
        ...state,
        findMeetingTimesLoading: false,
      };
    case 'FIND_MEETING_TIMES_SUCCESS':
      return {
        ...state,
        findMeetingTimesLoading: false,
        meetingSuggestions: action.payload,
      };
    case 'EMAIL_SEND_SUCCESS':
      return {
        ...state,
        loading: false,
        status: action.payload,
      };
    case 'CREATE_EVENT_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'CANCEL_EVENT_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default AuthReducer;
