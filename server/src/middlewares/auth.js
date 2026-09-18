import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../config/auth.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, _res, next) => {
  const authorization = req.get?.("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  const token = req.cookies?.[AUTH_COOKIE_NAME] ?? bearerToken;

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
    "name username email role active",
  );
  if (!user || !user.active) {
    return next(new AppError(401, "Authentication is no longer valid"));
  }

  req.user = user;
  return next();
};
