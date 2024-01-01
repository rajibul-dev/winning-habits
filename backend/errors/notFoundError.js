import CustomAPIError from "./customError.js";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
