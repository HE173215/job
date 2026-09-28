import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const normalizeError = (error) => {
  if (error instanceof AppError) return error;

  if (error.name === "ValidationError") {
    return new AppError(
      422,
      "Validation failed",
      Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    );
  }

  if (error.name === "CastError") {
    return new AppError(400, `Invalid value for ${error.path}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern ?? error.keyValue ?? {})[0] ?? "field";
    return new AppError(409, `A record with this ${field} already exists`, [
      { field, message: "Must be unique" },
    ]);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return new AppError(400, "Malformed JSON request body");
  }

  if (error.type === "entity.too.large") {
    return new AppError(413, "Request body is too large");
  }

  return error;
};

export const errorHandler = (error, req, res, _next) => {
  const normalized = normalizeError(error);
  const knownError = normalized.isOperational;
  const statusCode = knownError ? normalized.statusCode : 500;
  const production = env.nodeEnv === "production";

  const body = {
    success: false,
    message:
      production && !knownError ? "Internal server error" : normalized.message,
    errors: normalized.errors ?? [],
  };

  if (!production && normalized.stack) body.stack = normalized.stack;

  if (statusCode >= 500) {
    console.error(JSON.stringify({
      event: "request_error",
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: statusCode,
      message: normalized.message,
      stack: normalized.stack,
    }));
  }

  res.status(statusCode).json(body);
};
