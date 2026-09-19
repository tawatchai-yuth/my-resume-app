import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

import {
  accessSecret,
  refreshSecret,
  JWT_ISSUER,
  JWT_AUDIENCE,
} from "../../config/jwt.js";

import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";

import type { AuthUser, LoginInput, RegisterInput } from "./auth.types.js";

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput): Promise<AuthUser> {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthUser> {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function createAccessToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    type: "access",
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(env.accessTokenTtl)
    .sign(accessSecret);
}

export async function createRefreshToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: String(user.id),
    type: "refresh",
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(env.refreshTokenTtl)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  const result = await jwtVerify(token, accessSecret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  if (result.payload.type !== "access") {
    throw new Error("INVALID_TOKEN_TYPE");
  }

  return result;
}

export async function verifyRefreshToken(token: string) {
  const result = await jwtVerify(token, refreshSecret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  if (result.payload.type !== "refresh") {
    throw new Error("INVALID_TOKEN_TYPE");
  }

  return result;
}

export async function getUserById(userId: number): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
