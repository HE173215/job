import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { login, logout, me } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { AppError } from "../utils/AppError.js";
import { validateLogin } from "../validators/authValidator.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.nodeEnv === "production" ? 30 : 1000,
  skip: (req) =>
    env.nodeEnv !== "production" ||
    req.ip === "127.0.0.1" ||
    req.ip === "::1" ||
    req.ip === "::ffff:127.0.0.1" ||
    req.hostname === "localhost",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new AppError(429, "Too many login attempts, please try again later")),
});

router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
