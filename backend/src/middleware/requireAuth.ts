import type { NextFunction, Request, Response } from "express";

import {
  getUserById,
  verifyAccessToken,
} from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      throw new AppError(401, "Authentication required");
    }
    const verified = await verifyAccessToken(accessToken);
    const userId = Number(verified.payload.sub);
    if (!Number.isInteger(userId)) {
      throw new AppError(401, "Invalid authentication token");
    }
    const user = await getUserById(userId);
    if (!user) {
      throw new AppError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError(401, "Invalid or expired access token"));
  }
}
