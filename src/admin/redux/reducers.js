import { combineReducers } from 'redux';
import { credentialsReducer } from './credentials/reducers';
import { sitesReducer } from './sites/reducers';

const defaultReducer = (state = null) => state;

export const rootReducer = combineReducers({
  authUrl: defaultReducer,
  user: defaultReducer,
  isAuthorized: defaultReducer,
  credentials: credentialsReducer,
  sites: sitesReducer,
});
