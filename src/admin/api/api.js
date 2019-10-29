export const sendRequest = (url, method, body) => {
  const headers = {};

  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const sendPost = (url, body) => sendRequest(url, 'POST', body);
export const sendGet = url => sendRequest(url, 'GET');
export const sendPut = (url, body) => sendRequest(url, 'PUT', body);
export const sendDelete = (url, body) => sendRequest(url, 'DELETE', body);
