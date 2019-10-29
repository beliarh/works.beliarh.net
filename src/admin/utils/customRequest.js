const customRequest = ({ action, data, filename, file, headers, onSuccess, onError }) => {
  const formData = new FormData();
  const controller = window.AbortController && new AbortController();

  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
  }

  formData.append(filename, file);

  fetch(action, {
    method: 'POST',
    headers,
    body: formData,
    signal: controller && controller.signal,
  })
    .then(response => {
      if (response.headers.get('content-type') === 'application/json') {
        return response.json().then(body => ({ response, body }));
      }

      return response.text().then(body => ({ response, body }));
    })
    .then(({ response, body }) => {
      if (response.status < 200 || response.status >= 300) {
        const error = new Error(`cannot post ${action} ${response.status}`);

        error.status = response.status;
        error.method = 'POST';
        error.url = action;

        onError(error, body);
      } else {
        onSuccess(body, response);
      }
    })
    .catch(error => {
      onError(error);
    });

  return {
    abort() {
      if (controller) {
        controller.abort();
      }
    },
  };
};

export default customRequest;
