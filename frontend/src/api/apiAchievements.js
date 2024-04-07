import apiClient, { endpointV1 } from "./axiosConfig.js";

export async function getMyAchievements() {
  const res = await apiClient.get(`${endpointV1}/achievements/showMe`);
  return res.data;
}

export async function getOtherUserAchievements(id) {
  const res = await apiClient.get(`${endpointV1}/achievements/${id}`);
  return res.data;
}
