export async function register(req, res) {
  res.send("Registeration initilized.");
}

export async function verifyEmail(req, res) {
  res.send("Verified email");
}

export async function login(req, res) {
  res.send("Logged in successfully");
}

export async function logout(req, res) {
  res.send("Logged out successfully");
}

export async function forgotPassword(req, res) {
  res.send("Forgot password");
}

export async function resetPassword(req, res) {
  res.send("Password reset successfull");
}

export async function changePassword(req, res) {
  res.send("Password changed successfully");
}
