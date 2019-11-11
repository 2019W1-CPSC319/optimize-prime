import { combineReducers } from 'redux';
import user from './AuthReducer';
import directory from './DirectoryReducer';
import interviewers from './InterviewerReducer';
import rooms from './RoomReducer';

const RootReducer = combineReducers({
  user,
  directory,
  interviewers,
  rooms
});

export default RootReducer;
