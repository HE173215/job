import mongoose from "mongoose";
import { imageSchema } from "./schemas/imageSchema.js";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    excerpt: { type: String, trim: true, maxlength: 1000 },
    content: { type: String, trim: true, maxlength: 100000 },
    coverImage: imageSchema,
    gallery: { type: [imageSchema], default: [] },
    startDate: Date,
    endDate: Date,
    location: { type: String, trim: true, maxlength: 300 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

activitySchema.index({ published: 1, order: 1, startDate: -1 });
activitySchema.index({ featured: 1, published: 1 });

export const Activity = mongoose.model("Activity", activitySchema);
