import CustomAPIError from "./customError";
import { StatusCodes } from "http-status-codes";

export default class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
