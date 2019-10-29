import Data from './data';

const createCredentials = credentials => {
  const data = Data.read();
  const ids = data.credentials.map(credential => credential.id);
  let id = ids.length ? Math.max(...ids) + 1 : 1;

  credentials = credentials.map(credential => ({
    ...credential,
    id: id++,
  }));

  data.credentials.push(...credentials);
  Data.update();

  return credentials;
};

const readCredentials = () => {
  const data = Data.read();

  return data.credentials;
};

const updateCredentials = credentials => {
  const data = Data.read();

  data.credentials = data.credentials.map(credential => {
    const newCredential = credentials.find(({ id }) => credential.id === id);

    if (newCredential) {
      return {
        ...credential,
        ...newCredential,
      };
    }

    return credential;
  });

  Data.update();
};

const deleteCredentials = ids => {
  const data = Data.read();
  const countBefore = data.credentials.length;

  data.credentials = data.credentials.filter(({ id }) => !ids.includes(id));
  Data.update();

  const countAfter = data.credentials.length;

  return countBefore - countAfter;
};

export default {
  create: createCredentials,
  read: readCredentials,
  update: updateCredentials,
  delete: deleteCredentials,
};
