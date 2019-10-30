import { combineReducers } from 'redux';
import user from './AuthReducer';
import candidates from './CandidateReducer';

const RootReducer = combineReducers({
  user,
  candidates,
});

export default RootReducer;
