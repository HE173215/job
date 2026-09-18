import mongoose from "mongoose";
import { imageSchema, orderedImageSchema } from "./schemas/imageSchema.js";

const galleryAlbumSchema = new mongoose.Schema(
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
    description: { type: String, trim: true, maxlength: 5000 },
    coverImage: imageSchema,
    images: { type: [orderedImageSchema], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

galleryAlbumSchema.index({ published: 1, order: 1 });
galleryAlbumSchema.index({ featured: 1, published: 1 });

export const GalleryAlbum = mongoose.model("GalleryAlbum", galleryAlbumSchema);
