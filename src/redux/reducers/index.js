import { combineReducers } from 'redux';
import tasksReducer from './tasks';
import toasterReducer from './toaster';
import teamsReducer from './teams';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  toaster: toasterReducer,
  teams: teamsReducer
});

export default rootReducer;