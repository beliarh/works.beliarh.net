import {
  CREDENTIALS_FETCH_START,
  CREDENTIALS_FETCH_ERROR,
  CREDENTIALS_CREATE,
  CREDENTIALS_READ,
  CREDENTIALS_UPDATE,
  CREDENTIALS_DELETE,
} from './actions';

import { getRecordById } from '../../utils';

const initialState = {
  error: null,
  loading: false,
  list: [],
};

export const credentialsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREDENTIALS_FETCH_START:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case CREDENTIALS_FETCH_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case CREDENTIALS_CREATE:
      return {
        ...state,
        error: null,
        loading: false,
        list: [...state.list, ...action.payload.credentials],
      };

    case CREDENTIALS_READ:
      return {
        ...state,
        error: null,
        loading: false,
        list: action.payload.credentials,
      };

    case CREDENTIALS_UPDATE:
      return {
        ...state,
        error: null,
        loading: false,
        list: state.list.map(credential => {
          const newCredential = getRecordById(action.payload.credentials, credential.id);

          if (newCredential) {
            return {
              ...credential,
              ...newCredential,
            };
          }

          return credential;
        }),
      };

    case CREDENTIALS_DELETE:
      return {
        ...state,
        error: null,
        loading: false,
        list: state.list.filter(credential => !action.payload.ids.includes(credential.id)),
      };

    default:
      return state;
  }
};
