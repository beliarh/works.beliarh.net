import * as api from '../../api/credentials';

export const CREDENTIALS_FETCH_START = 'CREDENTIALS_FETCH_START';
export const CREDENTIALS_FETCH_ERROR = 'CREDENTIALS_FETCH_ERROR';
export const CREDENTIALS_CREATE = 'CREDENTIALS_CREATE';
export const CREDENTIALS_READ = 'CREDENTIALS_READ';
export const CREDENTIALS_UPDATE = 'CREDENTIALS_UPDATE';
export const CREDENTIALS_DELETE = 'CREDENTIALS_DELETE';

export const credentialsFetchStart = () => ({
  type: CREDENTIALS_FETCH_START,
});

export const credentialsFetchError = error => ({
  type: CREDENTIALS_FETCH_ERROR,
  payload: {
    error,
  },
});

export const credentialsCreate = (credentials, onSuccess) => dispatch => {
  dispatch(credentialsFetchStart());

  api
    .createCredentials(credentials)
    .then(({ status, data: newCredentials, message }) => {
      if (status === 'error') {
        dispatch(credentialsFetchError(message));
      } else {
        dispatch({
          type: CREDENTIALS_CREATE,
          payload: {
            credentials: newCredentials,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(credentialsFetchError(error.message));
    });
};

export const credentialsRead = onSuccess => dispatch => {
  dispatch(credentialsFetchStart());

  api
    .readCredentials()
    .then(({ status, data: credentials, message }) => {
      if (status === 'error') {
        dispatch(credentialsFetchError(message));
      } else {
        dispatch({
          type: CREDENTIALS_READ,
          payload: {
            credentials,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(credentialsFetchError(error.message));
    });
};

export const credentialsUpdate = (credentials, onSuccess) => dispatch => {
  dispatch(credentialsFetchStart());

  api
    .updateCredentials(credentials)
    .then(({ status, message }) => {
      if (status === 'error') {
        dispatch(credentialsFetchError(message));
      } else {
        dispatch({
          type: CREDENTIALS_UPDATE,
          payload: {
            credentials,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(credentialsFetchError(error.message));
    });
};

export const credentialsUpdateAfterSitesCreate = sites => (dispatch, getState) => {
  const state = getState();
  const credentials = [];

  for (const credential of state.credentials.list) {
    const siteIds = sites.filter(site => site.credentialIds.includes(credential.id)).map(site => site.id);

    if (siteIds.length) {
      credentials.push({
        id: credential.id,
        siteIds: [...credential.siteIds, ...siteIds],
      });
    }
  }

  dispatch({
    type: CREDENTIALS_UPDATE,
    payload: {
      credentials,
    },
  });
};

export const credentialsUpdateAfterSitesUpdate = sites => (dispatch, getState) => {
  const state = getState();
  const credentials = [];

  for (const credential of state.credentials.list) {
    const addedSiteIds = [];
    const deletedSiteIds = [];

    for (const site of sites) {
      const connectedBefore = credential.siteIds.includes(site.id);
      const connectedAfter = site.credentialIds.includes(credential.id);

      if (connectedBefore !== connectedAfter) {
        if (connectedAfter) {
          addedSiteIds.push(site.id);
        } else {
          deletedSiteIds.push(site.id);
        }
      }
    }

    if (addedSiteIds.length || deletedSiteIds.length) {
      credentials.push({
        id: credential.id,
        siteIds: [...credential.siteIds, ...addedSiteIds].filter(id => !deletedSiteIds.includes(id)),
      });
    }
  }

  dispatch({
    type: CREDENTIALS_UPDATE,
    payload: {
      credentials,
    },
  });
};

export const credentialsUpdateAfterSitesDelete = siteIds => (dispatch, getState) => {
  const state = getState();

  const credentials = state.credentials.list
    .filter(credential => credential.siteIds.some(id => siteIds.includes(id)))
    .map(credential => ({
      id: credential.id,
      siteIds: credential.siteIds.filter(id => !siteIds.includes(id)),
    }));

  dispatch({
    type: CREDENTIALS_UPDATE,
    payload: {
      credentials,
    },
  });
};

export const credentialsDelete = (ids, onSuccess) => dispatch => {
  dispatch(credentialsFetchStart());

  api
    .deleteCredentials(ids)
    .then(({ status, message }) => {
      if (status === 'error') {
        dispatch(credentialsFetchError(message));
      } else {
        dispatch({
          type: CREDENTIALS_DELETE,
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
      dispatch(credentialsFetchError(error.message));
    });
};
