import axios from "axios";

const axiosConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
};

const apiClient = axios.create({ ...axiosConfig, withCredentials: true });

export default apiClient;
