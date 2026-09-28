import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";
const VALID_NODE_ENVS = new Set(["development", "test", "production"]);
const clientUrl =
  process.env.CLIENT_URL ?? (nodeEnv === "production" ? undefined : "http://localhost:3000");

const parsePort = (value) => {
  const port = Number(value ?? 5000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
};

const parseInteger = (name, value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
};

const parseAllowedOrigins = (value, isProd) => {
  const fallback = isProd
    ? []
    : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"];
  if (!value) return fallback;

  const parsed = value
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return isProd ? [...new Set(parsed)] : [...new Set([...parsed, ...fallback])];
};

export const env = Object.freeze({
  port: parsePort(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl,
  allowedOrigins: parseAllowedOrigins(clientUrl, nodeEnv === "production"),
  nodeEnv,
  trustProxyHops: parseInteger("TRUST_PROXY_HOPS", process.env.TRUST_PROXY_HOPS, nodeEnv === "production" ? 1 : 0, { max: 10 }),
  shutdownTimeoutMs: parseInteger("SHUTDOWN_TIMEOUT_MS", process.env.SHUTDOWN_TIMEOUT_MS, 10_000, { min: 1_000, max: 60_000 }),
  mongoMaxPoolSize: parseInteger("MONGODB_MAX_POOL_SIZE", process.env.MONGODB_MAX_POOL_SIZE, 10, { min: 1, max: 100 }),
  cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  adminName: process.env.ADMIN_NAME,
  adminUsername: process.env.ADMIN_USERNAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
});

export const assertServerEnv = () => {
  if (!VALID_NODE_ENVS.has(env.nodeEnv)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }

  const missing = [
    ["MONGODB_URI", env.mongoUri],
    ["JWT_SECRET", env.jwtSecret],
    ["CLIENT_URL", env.clientUrl],
    ["CLOUDINARY_CLOUD_NAME", env.cloudinaryCloudName],
    ["CLOUDINARY_API_KEY", env.cloudinaryApiKey],
    ["CLOUDINARY_API_SECRET", env.cloudinaryApiSecret],
    ...(env.nodeEnv === "production"
      ? [["CLOUDINARY_UPLOAD_PRESET", env.cloudinaryUploadPreset]]
      : []),
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
