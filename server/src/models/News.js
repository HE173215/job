import mongoose from "mongoose";
import { imageSchema } from "./schemas/imageSchema.js";

const newsSchema = new mongoose.Schema(
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
    thumbnail: imageSchema,
    category: { type: String, trim: true, maxlength: 100 },
    tags: { type: [{ type: String, trim: true, maxlength: 50 }], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true },
);

newsSchema.index({ published: 1, publishedAt: -1 });
newsSchema.index({ featured: 1, published: 1 });
newsSchema.index({ category: 1, published: 1 });

export const News = mongoose.model("News", newsSchema);
