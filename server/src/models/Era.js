import mongoose from "mongoose";

const eraSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    name: { type: String, required: true, trim: true },
    timeframe: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    quote: { type: String, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

eraSchema.index({ order: 1, startYear: 1 });

export const Era = mongoose.model("Era", eraSchema);
