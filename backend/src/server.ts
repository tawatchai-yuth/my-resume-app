import "dotenv/config";

import { app } from "./app.js";
import { logger } from "./config/logger.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  logger.info(
    {
      host: HOST,
      port: PORT,
      environment: process.env.NODE_ENV ?? "development",
    },
    "Server started",
  );
});

function shutdown(signal: string): void {
  logger.info({ signal }, "Shutdown signal received");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
}

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
