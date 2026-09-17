import "dotenv/config";

import { app } from "./app.js";
import { prisma } from "./config/prisma.js";

const PORT = Number(process.env.PORT ?? 3000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(async (error) => {
    if (error) {
      console.error("Failed to close server:", error);
      await prisma.$disconnect();
      process.exit(1);
    }
    await prisma.$disconnect();
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
