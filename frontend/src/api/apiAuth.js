import apiClient from "./axiosConfig";
import { endpointV1 } from "./axiosConfig.js";

const authEndpoint = `${endpointV1}/auth`;

export async function register({ name, email, password }) {
  const res = await apiClient.post(`${authEndpoint}/register`, {
    name,
    email,
    password,
  });
  return res.data;
}

export async function verifyEmail({ verificationToken, email }) {
  const res = await apiClient.post(`${authEndpoint}/email/verify`, {
    email,
    verificationToken,
  });
  return res.data;
}

export async function login({ email, password }) {
  const res = await apiClient.post(`${authEndpoint}/login`, {
    email,
    password,
  });
  return res.data;
}

export async function logout() {
  const res = await apiClient.post(`${authEndpoint}/logout`);
  return res.data;
}

export async function loginWithGoogle({ name, email, avatar }) {
  const res = await apiClient.post(`${authEndpoint}/oauth/google`, {
    name,
    email,
    avatar,
  });
  return res.data;
}

export async function requestNewVerificationEmail(email) {
  const res = await apiClient.post(`${authEndpoint}/email/resend-verification`, {
    email,
  });
  return res.data;
}

export async function forgotPassword(email) {
  const res = await apiClient.post(`${authEndpoint}/password/forgot`, {
    email,
  });
  return res.data;
}

export async function resetPassword({ email, token, password }) {
  const res = await apiClient.post(`${authEndpoint}/password/reset`, {
    email,
    token,
    password,
  });
  return res.data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const res = await apiClient.patch(`${authEndpoint}/password`, {
    currentPassword,
    newPassword,
  });
  return res.data;
}
