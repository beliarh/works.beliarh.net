import * as api from '../../api/sites';

import {
  credentialsUpdateAfterSitesUpdate,
  credentialsUpdateAfterSitesDelete,
  credentialsUpdateAfterSitesCreate,
} from '../credentials/actions';

export const SITES_FETCH_START = 'SITES_FETCH_START';
export const SITES_FETCH_ERROR = 'SITES_FETCH_ERROR';
export const SITES_CREATE = 'SITES_CREATE';
export const SITES_READ = 'SITES_READ';
export const SITES_UPDATE = 'SITES_UPDATE';
export const SITES_DELETE = 'SITES_DELETE';

export const sitesFetchStart = () => ({
  type: SITES_FETCH_START,
});

export const sitesFetchError = error => ({
  type: SITES_FETCH_ERROR,
  payload: {
    error,
  },
});

export const sitesCreate = (sites, onSuccess) => dispatch => {
  dispatch(sitesFetchStart());

  api
    .createSites(sites)
    .then(({ status, data: newSites, message }) => {
      if (status === 'error') {
        dispatch(sitesFetchError(message));
      } else {
        dispatch(
          credentialsUpdateAfterSitesCreate(
            sites.map((site, index) => ({
              ...site,
              id: newSites[index].id,
            }))
          )
        );

        dispatch({
          type: SITES_CREATE,
          payload: {
            // eslint-disable-next-line no-unused-vars
            sites: newSites.map(({ credentialIds, ...site }) => site),
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(sitesFetchError(error.message));
    });
};

export const sitesRead = onSuccess => dispatch => {
  dispatch(sitesFetchStart());

  api
    .readSites()
    .then(({ status, data: sites, message }) => {
      if (status === 'error') {
        dispatch(sitesFetchError(message));
      } else {
        dispatch({
          type: SITES_READ,
          payload: {
            sites,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(sitesFetchError(error.message));
    });
};

export const sitesUpdate = (sites, onSuccess) => dispatch => {
  dispatch(sitesFetchStart());

  api
    .updateSites(sites)
    .then(({ status, message }) => {
      if (status === 'error') {
        dispatch(sitesFetchError(message));
      } else {
        dispatch(credentialsUpdateAfterSitesUpdate(sites));

        dispatch({
          type: SITES_UPDATE,
          payload: {
            // eslint-disable-next-line no-unused-vars
            sites: sites.map(({ credentialIds, ...site }) => site),
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(sitesFetchError(error.message));
    });
};

export const sitesDelete = (ids, onSuccess) => dispatch => {
  dispatch(sitesFetchStart());

  api
    .deleteSites(ids)
    .then(({ status, message }) => {
      if (status === 'error') {
        dispatch(sitesFetchError(message));
      } else {
        dispatch(credentialsUpdateAfterSitesDelete(ids));

        dispatch({
          type: SITES_DELETE,
          payload: {
            ids,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(sitesFetchError(error.message));
    });
};
