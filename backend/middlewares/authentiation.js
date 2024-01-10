import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import Token from "../models/TokenModel.js";
import { attachCookiesToResponse, isTokenValid } from "../utils/jwt/jwt.js";

export async function authenticateUser(req, res, next) {
  // the refresh token is not exactly the refretoken, it's an object that contains user and token jwt that needs decoding
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload;
      return next();
    }

    // decoding and getting the actual refresh token and user
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userID,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      refreshToken: existingToken.refreshToken,
      user: payload.user,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
}

export function authorizePermissions(...roles) {
  return function (req, res, next) {
    // restriction check first
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        "You don't have the permission to access this route",
      );
    }

    // allow access afterwards
    next();
  };
}
