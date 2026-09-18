import mongoose from "mongoose";

const imageFields = () => ({
  publicId: { type: String, trim: true, maxlength: 500 },
  url: { type: String, trim: true, maxlength: 2048 },
  alt: { type: String, trim: true, maxlength: 300 },
  caption: { type: String, trim: true, maxlength: 1000 },
  width: { type: Number, min: 0 },
  height: { type: Number, min: 0 },
  format: { type: String, trim: true, maxlength: 30 },
  bytes: { type: Number, min: 0 },
});

export const imageSchema = new mongoose.Schema(imageFields(), { _id: false });

export const orderedImageSchema = new mongoose.Schema(
  { ...imageFields(), order: { type: Number, default: 0 } },
  { _id: false },
);
