import apiClient, { endpointV1 } from "./axiosConfig.js";

export async function getAllUsers() {
  const res = await apiClient.get(`${endpointV1}/users/getAllUsersLength`);
  return res.data;
}
