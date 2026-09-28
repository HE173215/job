import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import "../src/models/Activity.js";
import "../src/models/AdminAuditLog.js";
import "../src/models/Battalion.js";
import "../src/models/Era.js";
import "../src/models/GalleryAlbum.js";
import "../src/models/Introduction.js";
import "../src/models/Milestone.js";
import "../src/models/News.js";
import "../src/models/User.js";

const createIndexes = async () => {
  if (!env.mongoUri) throw new Error("MONGODB_URI is required");
  await connectDatabase();
  for (const model of Object.values(mongoose.models)) {
    await model.createIndexes();
    console.info(`Indexes ready: ${model.modelName}`);
  }
};

createIndexes()
  .catch((error) => {
    console.error(`Index creation failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
