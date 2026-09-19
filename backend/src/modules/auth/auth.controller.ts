import type { Request, Response } from "express";

import {
  createAccessToken,
  createRefreshToken,
  getUserById,
  loginUser,
  registerUser,
  verifyRefreshToken,
} from "./auth.service.js";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }
    const user = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return res.status(201).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
    const user = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }
    const verified = await verifyRefreshToken(refreshToken);
    const userId = Number(verified.payload.sub);
    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    const accessToken = await createAccessToken(user);
    const newRefreshToken = await createRefreshToken(user);
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      user,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
  return res.status(204).send();
}
