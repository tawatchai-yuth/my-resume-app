import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { logger } from "../../config/logger.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, (() => {
    logger.info("Get Me")
}));