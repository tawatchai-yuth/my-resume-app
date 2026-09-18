import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
): void => {
  logger.error(error, "Unhandled error");
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};
