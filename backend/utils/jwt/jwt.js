import jwt from "jsonwebtoken";

export function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function isTokenValid(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function attachCookiesToResponse({ res, user, refreshToken }) {
  // generate two types of tokens: access and refresh token
  // access is for short term, refresh is for long term, why? how they co-relate? we will get to that in the auth middleware
  const accessTokenJWT = createJWT({ user });
  const refreshTokenJWT = createJWT({ user, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneEightyDays = 1000 * 60 * 60 * 24 * 180;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneEightyDays),
  });
}
