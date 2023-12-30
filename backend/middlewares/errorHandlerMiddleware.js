import { StatusCodes } from "http-status-codes";

export default function errorHandlerMiddleware(err, req, res, next) {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `Something went wrong, try again later`,
  };

  return res.status(customError.statusCode).json({ msg: customError.msg });
}
