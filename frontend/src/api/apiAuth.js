import apiClient from "./axiosConfig";

async function register({ name, email, password }) {
  const res = await apiClient.post("/api/v1/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
}

async function verifyEmail({ verificationToken, email }) {
  const res = await apiClient.post("/api/v1/auth/verify-email", {
    email,
    verificationToken,
  });
  return res.data;
}

async function login({ email, password }) {
  const res = await apiClient.post("/api/v1/auth/login", {
    email,
    password,
  });
  return res.data;
}

async function logout() {
  const res = await apiClient.get("/api/v1/auth/logout");
  return res.data;
}

async function requestNewVerificationEmail(email) {
  const res = await apiClient.post(
    "/api/v1/auth/request-new-verification-email",
    { email },
  );
  return res.data;
}

async function forgotPassword(email) {
  const res = await apiClient.post("/api/v1/auth/forgot-password", {
    email,
  });
  return res.data;
}

async function resetPassword({ email, token, password }) {
  const res = await apiClient.post("/api/v1/auth/reset-password", {
    email,
    token,
    password,
  });
  return res.data;
}

async function changePassword({ currentPassword, newPassword }) {
  const res = await apiClient.post("/api/v1/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
}

export {
  register,
  verifyEmail,
  login,
  logout,
  requestNewVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
