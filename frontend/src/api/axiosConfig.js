import axios from "axios";

const axiosConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
};

const apiClient = axios.create({ ...axiosConfig, withCredentials: true });

// get user's timezone
apiClient.interceptors.request.use((config) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  config.headers["x-timezone"] = timezone;
  return config;
});

export default apiClient;

export const endpointV1 = `/api/v1`;
