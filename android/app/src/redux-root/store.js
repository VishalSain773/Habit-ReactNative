import { createStore, combineReducers } from 'redux';
import userIdReducer from './reducers/userIdReducer';

const rootReducer = combineReducers({
  userId: userIdReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;