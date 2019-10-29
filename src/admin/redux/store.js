import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
import { sitesRead } from './sites/actions';
import { credentialsRead } from './credentials/actions';

const preloadedState = window.__PRELOADED_STATE__;

const store = createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : x => x
  )
);

if (!preloadedState || (preloadedState.isAuthorized && !preloadedState.sites)) {
  store.dispatch(sitesRead());
}

if (!preloadedState || (preloadedState.isAuthorized && !preloadedState.credentials)) {
  store.dispatch(credentialsRead());
}

export default store;
