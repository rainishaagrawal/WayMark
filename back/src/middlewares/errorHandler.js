import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../constants.js";

export const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = error.message || RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR;
    let errors = error.errors || [];

    if (error.name === "ValidationError") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = RESPONSE_MESSAGES.VALIDATION_ERROR;
      errors = Object.values(error.errors || {}).map((el) => el.message);
    } else if (error.code === 11000) {
      statusCode = HTTP_STATUS.CONFLICT;
      const field = Object.keys(error.keyValue || {})[0] || "field";
      message = `Duplicate value entered for ${field}. Please use another value.`;
    } else if (error.name === "CastError") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Invalid resource ID format: ${error.value}`;
    } else if (error.name === "JsonWebTokenError") {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = "Invalid token provided. Access denied.";
    } else if (error.name === "TokenExpiredError") {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = "Token has expired. Please authenticate again.";
    }

    error = new ApiError(statusCode, message, errors, error.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error("💥 [Global Error Handler]:", error);
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
