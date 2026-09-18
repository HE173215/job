import mongoose from "mongoose";
import { imageSchema } from "./schemas/imageSchema.js";

const milestoneSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, min: 0, max: 9999 },
    date: Date,
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
    summary: { type: String, trim: true, maxlength: 1000 },
    content: { type: String, trim: true, maxlength: 100000 },
    era: { type: String, trim: true, maxlength: 200 },
    coverImage: imageSchema,
    gallery: { type: [imageSchema], default: [] },
    source: { type: String, trim: true, maxlength: 2000 },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

milestoneSchema.index({ published: 1, order: 1, year: 1 });
milestoneSchema.index({ featured: 1, published: 1 });
milestoneSchema.index({ era: 1, published: 1 });

export const Milestone = mongoose.model("Milestone", milestoneSchema);
