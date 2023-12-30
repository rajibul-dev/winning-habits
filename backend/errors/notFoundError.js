import CustomAPIError from "./customError";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
