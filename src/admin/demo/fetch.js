import 'whatwg-fetch';

const originalFetch = window.fetch;

export const patchFetch = map => {
  window.fetch = (url, { method, body, ...options } = {}) => {
    const action = map[url] && map[url][method];

    if (action) {
      return new Promise(resolve => {
        setTimeout(() => {
          const data = action(body);

          const blob = new Blob(
            [
              JSON.stringify({
                status: 'success',
                data,
              }),
            ],
            {
              type: 'application/json',
            }
          );

          const response = new Response(blob, {
            status: 200,
            statusText: 'OK',
          });

          resolve(response);
        }, 500);
      });
    }

    return originalFetch(url, { method, body, ...options });
  };
};
