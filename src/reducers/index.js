import { combineReducers } from 'redux';
import user from './AuthReducer';
import nav from './NavReducer';

const RootReducer = combineReducers({
  user,
  nav,
});

export default RootReducer;
