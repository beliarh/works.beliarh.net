import Data from './data';

const createSites = sites => {
  const data = Data.read();
  const ids = data.sites.map(site => site.id);
  let id = ids.length ? Math.max(...ids) + 1 : 1;

  sites = sites.map(site => ({
    ...site,
    id: id++,
    active: true,
  }));

  data.credentials = data.credentials.map(credential => {
    const siteIds = sites.filter(site => site.credentialIds.includes(credential.id)).map(credential => credential.id);

    if (siteIds.length) {
      return {
        ...credential,
        siteIds: [...credential.siteIds, ...siteIds],
      };
    }

    return credential;
  });

  // eslint-disable-next-line no-unused-vars
  data.sites.push(...sites.map(({ credentialIds, ...site }) => site));
  Data.update();

  return sites;
};

const readSites = () => {
  const data = Data.read();

  return data.sites;
};

const updateSites = sites => {
  const data = Data.read();

  data.sites = data.sites.map(site => {
    const { credentialIds, ...newSite } = sites.find(({ id }) => site.id === id) || {};

    if (newSite) {
      for (const credential of data.credentials) {
        const connectedBefore = credential.siteIds.includes(site.id);
        const connectedAfter = credentialIds.includes(credential.id);

        if (connectedBefore !== connectedAfter) {
          if (connectedAfter) {
            credential.siteIds.push(site.id);
          } else {
            credential.siteIds = credential.siteIds.filter(({ id }) => id !== site.id);
          }
        }
      }

      return {
        ...site,
        ...newSite,
      };
    }

    return site;
  });

  Data.update();
};

const deleteSites = ids => {
  const data = Data.read();
  const countBefore = data.sites.length;

  data.credentials = data.credentials.map(credential => ({
    ...credential,
    siteIds: credential.siteIds.filter(id => !ids.includes(id)),
  }));

  data.sites = data.sites.filter(({ id }) => !ids.includes(id));
  Data.update();

  const countAfter = data.sites.length;

  return countBefore - countAfter;
};

export default {
  create: createSites,
  read: readSites,
  update: updateSites,
  delete: deleteSites,
};
