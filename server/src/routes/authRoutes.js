import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env.js";
import { login, logout, me } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { AppError } from "../utils/AppError.js";
import { validateLogin } from "../validators/authValidator.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.nodeEnv === "production" ? 10 : 1000,
  skip: () => env.nodeEnv !== "production",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new AppError(429, "Too many login attempts, please try again later")),
});
const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.nodeEnv === "production" ? 5 : 1000,
  skip: () => env.nodeEnv !== "production",
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.validated.username}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new AppError(429, "Too many login attempts, please try again later")),
});

router.post("/login", loginLimiter, validateLogin, loginAccountLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
