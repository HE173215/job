import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { AppError } from "../utils/AppError.js";
import { validateLogin } from "../validators/authValidator.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new AppError(429, "Too many login attempts, please try again later")),
});

router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
