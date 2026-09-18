import { AppError } from "../utils/AppError.js";

export const validateLogin = (req, _res, next) => {
  const errors = [];
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || !username.trim()) {
    errors.push({ field: "username", message: "Username is required" });
  } else if (username.length > 50) {
    errors.push({ field: "username", message: "Username is too long" });
  }

  if (typeof password !== "string" || !password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length > 256) {
    errors.push({ field: "password", message: "Password is too long" });
  }

  if (errors.length) return next(new AppError(422, "Validation failed", errors));

  req.validated = { username: username.trim().toLowerCase(), password };
  return next();
};
