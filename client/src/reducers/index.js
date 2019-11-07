import { combineReducers } from 'redux';
import user from './AuthReducer';

import candidates from './CandidateReducer';
import directory from './DirectoryReducer';
import rooms from './RoomReducer';
import interviewers from './InterviewerReducer';

const RootReducer = combineReducers({
  user,
  candidates,
  interviewers,
  directory,
  rooms,
});

export default RootReducer;