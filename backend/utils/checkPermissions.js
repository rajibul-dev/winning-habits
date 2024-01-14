import { UnauthenticatedError } from "../errors/index.js";

export default function (requestUser, resourceUserID) {
  if (requestUser.role === "admin") return;
  if (requestUser.userID === resourceUserID.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this route");
}
