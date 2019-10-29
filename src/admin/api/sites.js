import { sendPost, sendGet, sendPut, sendDelete } from './api';

const url = '/api/sites.php';

export const createSites = sites => sendPost(url, sites);
export const readSites = () => sendGet(url);
export const updateSites = sites => sendPut(url, sites);
export const deleteSites = ids => sendDelete(url, ids);
