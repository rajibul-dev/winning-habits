import apiClient from "./axiosConfig";
import { endpointV1 } from "./axiosConfig.js";

export async function register({ name, email, password }) {
  const res = await apiClient.post(`${endpointV1}/auth/register`, {
    name,
    email,
    password,
  });
  return res.data;
}

export async function verifyEmail({ verificationToken, email }) {
  const res = await apiClient.post(`${endpointV1}/auth/verify-email`, {
    email,
    verificationToken,
  });
  return res.data;
}

export async function login({ email, password }) {
  const res = await apiClient.post(`${endpointV1}/auth/login`, {
    email,
    password,
  });
  return res.data;
}

export async function getCurrentUser() {
  const res = await apiClient.get(`${endpointV1}/users/showMe`);
  return res.data;
}

export async function logout() {
  const res = await apiClient.get(`${endpointV1}/auth/logout`);
  return res.data;
}

export async function requestNewVerificationEmail(email) {
  const res = await apiClient.post(
    `${endpointV1}/auth/request-new-verification-email`,
    { email },
  );
  return res.data;
}

export async function forgotPassword(email) {
  const res = await apiClient.post(`${endpointV1}/auth/forgot-password`, {
    email,
  });
  return res.data;
}

export async function resetPassword({ email, token, password }) {
  const res = await apiClient.post(`${endpointV1}/auth/reset-password`, {
    email,
    token,
    password,
  });
  return res.data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const res = await apiClient.post(`${endpointV1}/auth/change-password`, {
    currentPassword,
    newPassword,
  });
  return res.data;
}
