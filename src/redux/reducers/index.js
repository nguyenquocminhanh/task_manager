import { combineReducers } from 'redux';
import tasksReducer from './tasks';
import toasterReducer from './toaster';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  toaster: toasterReducer
});

export default rootReducer;