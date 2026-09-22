import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import activityRoutes from "./routes/activityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import introductionRoutes from "./routes/introductionRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import eraRoutes from "./routes/eraRoutes.js";
import battalionRoutes from "./routes/battalionRoutes.js";
import { AppError } from "./utils/AppError.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new AppError(403, "Origin is not allowed"));
    },
  }),
);
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.nodeEnv === "production" ? 1500 : 20000,
    skip: (req) =>
      env.nodeEnv !== "production" ||
      req.ip === "127.0.0.1" ||
      req.ip === "::1" ||
      req.ip === "::ffff:127.0.0.1" ||
      req.hostname === "localhost",
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(new AppError(429, "Too many requests, please try again later")),
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/introduction", introductionRoutes);
app.use("/api/v1/eras", eraRoutes);
app.use("/api/v1/battalions", battalionRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);
