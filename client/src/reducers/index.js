import { combineReducers } from 'redux';
import user from './AuthReducer';
import directory from './DirectoryReducer';
import rooms from './RoomReducer';

const RootReducer = combineReducers({
  user,
  directory,
  rooms
});

export default RootReducer;
