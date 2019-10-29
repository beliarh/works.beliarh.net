import { SITES_FETCH_START, SITES_FETCH_ERROR, SITES_CREATE, SITES_READ, SITES_UPDATE, SITES_DELETE } from './actions';
import { getRecordById } from '../../utils';

const initialState = {
  error: null,
  loading: false,
  list: [],
};

export const sitesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SITES_FETCH_START:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case SITES_FETCH_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case SITES_CREATE:
      return {
        ...state,
        error: null,
        loading: false,
        list: [...state.list, ...action.payload.sites],
      };

    case SITES_READ:
      return {
        ...state,
        error: null,
        loading: false,
        list: action.payload.sites,
      };

    case SITES_UPDATE:
      return {
        ...state,
        error: null,
        loading: false,
        list: state.list.map(site => {
          const newSite = getRecordById(action.payload.sites, site.id);

          if (newSite) {
            return {
              ...site,
              ...newSite,
            };
          }

          return site;
        }),
      };

    case SITES_DELETE:
      return {
        ...state,
        error: null,
        loading: false,
        list: state.list.filter(site => !action.payload.ids.includes(site.id)),
      };

    default:
      return state;
  }
};
