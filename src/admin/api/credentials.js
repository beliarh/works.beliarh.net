import { sendPost, sendGet, sendPut, sendDelete } from './api';

const url = '/api/credentials.php';

export const createCredentials = credentials => sendPost(url, credentials);
export const readCredentials = () => sendGet(url);
export const updateCredentials = credentials => sendPut(url, credentials);
export const deleteCredentials = ids => sendDelete(url, ids);
