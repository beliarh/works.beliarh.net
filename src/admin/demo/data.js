let data;

const readData = () => {
  if (!data) {
    try {
      data = localStorage.getItem('data');
      data = JSON.parse(data) || {};

      if (typeof data !== 'object') {
        data = {};
      }

      if (!data.credentials) {
        data.credentials = [];
      }

      if (!data.sites) {
        data.sites = [];
      }
    } catch {
      data = {
        credentials: [],
        sites: [],
      };
    }

    updateData();
  }

  return data;
};

const updateData = () => {
  try {
    localStorage.setItem('data', JSON.stringify(data));
  } catch {
    // ¯\_(ツ)_/¯
  }
};

export default {
  read: readData,
  update: updateData,
};
