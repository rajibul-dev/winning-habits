import apiClient, { endpointV1 } from "./axiosConfig.js";

const usersEndpoint = `${endpointV1}/users`;
const currentUserEndpoint = `${usersEndpoint}/me`;

export async function getUserCount() {
  const res = await apiClient.get(`${usersEndpoint}/count`);
  return res.data;
}

export async function getCurrentUser() {
  const res = await apiClient.get(currentUserEndpoint);
  return res.data;
}

export async function updateCurrentUser({ name }) {
  const res = await apiClient.patch(currentUserEndpoint, { name });
  return res.data;
}

export async function updateCurrentUserAvatar(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("upload_preset", "friendsbook");

  const res = await apiClient.patch(`${currentUserEndpoint}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function deleteCurrentUserAvatar() {
  const res = await apiClient.delete(`${currentUserEndpoint}/avatar`);
  return res.data;
}

export async function deleteCurrentUser() {
  const res = await apiClient.delete(currentUserEndpoint);
  return res.data;
}

export async function getUserById(userID) {
  const res = await apiClient.get(`${usersEndpoint}/${userID}`);
  return res.data;
}

export async function deleteUserById(userID) {
  const res = await apiClient.delete(`${usersEndpoint}/${userID}`);
  return res.data;
}
