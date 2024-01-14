import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import Token from "../models/TokenModel.js";
import { attachCookiesToResponse, isTokenValid } from "../utils/jwt/jwt.js";

export async function authenticateUser(req, res, next) {
  // the refresh token is not exactly the refretoken, it's an object that contains user and a jwt token that needs decoding
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      // decode access token and attatch user to the req.user, we can then do things with it in the midlewares that lies next
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    // decoding and getting the actual refresh token and userID (role and name too)
    const payload = isTokenValid(refreshToken);

    // for validating and attatching refresh and access tokens in the cookies
    const existingToken = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userID,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    // we end up setting cookies from cookies, a new access token cookie, and the same refresh token cookie
    attachCookiesToResponse({
      res,
      refreshToken: existingToken.refreshToken,
      user: payload.user,
    });

    // yup, we like to see it, the user is in the req object, we can do things with it in the midlewares that lies next
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
