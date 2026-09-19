import { TextEncoder } from "node:util";
import { env } from "./env.js";

export const accessSecret = new TextEncoder().encode(env.jwtAccessSecret);

export const refreshSecret = new TextEncoder().encode(env.jwtRefreshSecret);

export const JWT_ISSUER = "my-resume-app";
export const JWT_AUDIENCE = "my-resume-app-users";
