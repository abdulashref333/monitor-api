import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    config.data = {};
    config.data["startTime"] = new Date().getTime();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const endTime = new Date().getTime();
    response.data = { data: response.data };
    response.data.duration = Number(endTime - JSON.parse(response.config.data).startTime);
    return response;
  },
  function (error) {
    const endTime = new Date().getTime();
    error.duration = Number(endTime - JSON.parse(error.config.data).startTime);
    return Promise.reject(error);
  }
);

export default axios;
