import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { logger } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.disable("x-powered-by");

/**
 * Security
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3001",
    credentials: true,
  }),
);

/**
 * HTTP logging
 */
app.use(
  pinoHttp({
    logger,
  }),
);

/**
 * Body parsing
 */
app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness check
 */
app.get("/health/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ready",
      service: "backend",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(error, "Database health check failed");

    res.status(503).json({
      status: "not_ready",
      service: "backend",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * API
 */
app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

/**
 * 404
 */
app.use(notFound);

/**
 * Global error handler
 *
 * Must be registered after all routes.
 */
app.use(errorHandler);

export { app };
