import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../config/auth.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, _res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
      issuer: "political-officer-school-api",
      audience: "political-officer-school-admin",
    });
  } catch {
    return next(new AppError(401, "Invalid or expired authentication token"));
  }

  const user = await User.findById(payload.sub).select(
    "name username email role active +tokenVersion",
  );
  if (!user || !user.active || payload.ver !== (user.tokenVersion ?? 0)) {
    return next(new AppError(401, "Authentication is no longer valid"));
  }

  req.user = user;
  return next();
};
