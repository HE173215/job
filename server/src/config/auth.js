import { env } from "./env.js";

export const AUTH_COOKIE_NAME = "token";

export const authCookieOptions = Object.freeze({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/",
});
