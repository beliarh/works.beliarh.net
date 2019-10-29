import Data from './data';
import Credentials from './credentials';
import Sites from './sites';
import { patchFetch } from './fetch';

if (window.location.search.indexOf('demo') !== -1) {
  const { credentials, sites } = Data.read();

  patchFetch({
    '/api/credentials.php': {
      POST: body => Credentials.create(JSON.parse(body)),
      GET: () => Credentials.read(),
      PUT: body => Credentials.update(JSON.parse(body)),
      DELETE: body => Credentials.delete(JSON.parse(body)),
    },
    '/api/sites.php': {
      POST: body => Sites.create(JSON.parse(body)),
      GET: () => Sites.read(),
      PUT: body => Sites.update(JSON.parse(body)),
      DELETE: body => Sites.delete(JSON.parse(body)),
    },
    '/api/upload-image.php': {
      POST: () => '/images/demo.png',
    },
  });

  window.__PRELOADED_STATE__ = {
    user: {},
    isAuthorized: true,
    credentials: {
      list: JSON.parse(JSON.stringify(credentials)),
    },
    sites: {
      list: JSON.parse(JSON.stringify(sites)),
    },
  };
}
