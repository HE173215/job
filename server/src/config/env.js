import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";
const clientUrl =
  process.env.CLIENT_URL ?? (nodeEnv === "production" ? undefined : "http://localhost:3000");

const parsePort = (value) => {
  const port = Number(value ?? 5000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
};

export const env = Object.freeze({
  port: parsePort(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl,
  allowedOrigins:
    nodeEnv === "production"
      ? [clientUrl].filter(Boolean)
      : [...new Set([clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean))],
  nodeEnv,
  adminName: process.env.ADMIN_NAME,
  adminUsername: process.env.ADMIN_USERNAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
});

export const assertServerEnv = () => {
  const missing = [
    ["MONGODB_URI", env.mongoUri],
    ["JWT_SECRET", env.jwtSecret],
    ["CLIENT_URL", env.clientUrl],
    ["CLOUDINARY_CLOUD_NAME", env.cloudinaryCloudName],
    ["CLOUDINARY_API_KEY", env.cloudinaryApiKey],
    ["CLOUDINARY_API_SECRET", env.cloudinaryApiSecret],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (env.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
};

export const assertAdminEnv = () => {
  const missing = [
    ["ADMIN_NAME", env.adminName],
    ["ADMIN_USERNAME", env.adminUsername],
    ["ADMIN_EMAIL", env.adminEmail],
    ["ADMIN_PASSWORD", env.adminPassword],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing required admin environment variables: ${missing.join(", ")}`);
  }

  if (env.adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters");
  }
};
