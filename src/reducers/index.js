import { combineReducers } from 'redux';
import user from './AuthReducer';

const RootReducer = combineReducers({
  user,
});

export default RootReducer;
