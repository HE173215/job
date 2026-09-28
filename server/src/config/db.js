import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
    maxPoolSize: env.mongoMaxPoolSize,
    serverSelectionTimeoutMS: 10_000,
  });
};

export const disconnectDatabase = () => mongoose.disconnect();
