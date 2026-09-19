import type { ErrorRequestHandler } from "express";

import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
): void => {
  if (error instanceof AppError) {
    logger.warn(
      {
        err: error,
        statusCode: error.statusCode,
      },
      "Operational error",
    );
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
    return;
  }
  logger.error(
    {
      err: error,
    },
    "Unhandled error",
  );
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};
