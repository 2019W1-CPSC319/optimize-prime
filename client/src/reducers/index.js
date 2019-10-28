import { combineReducers } from 'redux';
import user from './AuthReducer';
import directory from './DirectoryReducer';

const RootReducer = combineReducers({
  user,
  directory,
});

export default RootReducer;
