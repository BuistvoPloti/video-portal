const axios = require('axios');

const postBackVideoData = async (callbackURL, responseData) => {
  const data = {
    data: {
      video: responseData
    }
  };
  return axios.post(callbackURL, data);
};

module.exports = {
  postBackVideoData,
};
