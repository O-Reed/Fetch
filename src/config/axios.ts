import axios from "axios";

const api = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true
});

api.interceptors.response.use(
  response => response.data,
  async error => {
    const { response } = error;
    const { status } = response || {};

    if (status === 401 || status === 403) {
      window.location.href = "/login";
    }

    return Promise.reject(status);
  }
);

export { api };
