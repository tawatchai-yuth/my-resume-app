import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { logger } from "./config/logger.js";
import { prisma } from "./lib/prisma.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { userRouter } from "./modules/users/users.routes.js";

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
    logger.error(
      {
        err: error,
      },
      "Database health check failed",
    );

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
 * Authentication API
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout
 */
app.use("/api/auth", authRouter);

/**
 * Users API
 *
 * GET /api/users/me
 */
app.use("/api/users", userRouter);

/**
 * 404
 *
 * Must be registered after all routes.
 */
app.use(notFound);

/**
 * Global error handler
 *
 * Must be registered after all routes
 * and the notFound middleware.
 */
app.use(errorHandler);

export { app };
