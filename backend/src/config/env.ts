function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  port: Number(process.env.PORT ?? 3000),

  host: Number(process.env.HOST ?? 3000),

  databaseUrl: getRequiredEnv("DATABASE_URL"),

  frontendUrl: getRequiredEnv("FRONTEND_URL"),

  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),

  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),

  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",

  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? "7d",
};
