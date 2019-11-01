import { combineReducers } from 'redux';
import user from './AuthReducer';
import candidates from './CandidateReducer';
import interviewers from './InterviewerReducer';

const RootReducer = combineReducers({
  user,
  candidates,
  interviewers,
});

export default RootReducer;
