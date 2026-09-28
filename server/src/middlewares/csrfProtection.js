import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../config/auth.js";
import { AppError } from "../utils/AppError.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  const fetchSite = req.get("sec-fetch-site");
  const usesAuthCookie = Boolean(req.cookies?.[AUTH_COOKIE_NAME]);

  if (fetchSite === "cross-site") {
    return next(new AppError(403, "Cross-site request is not allowed"));
  }

  if (origin && !env.allowedOrigins.includes(origin)) {
    return next(new AppError(403, "Origin is not allowed"));
  }

  if (usesAuthCookie && !origin) {
    return next(new AppError(403, "Origin header is required"));
  }

  return next();
};
