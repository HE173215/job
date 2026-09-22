import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: true, trim: true },
    date: { type: String, trim: true },
    category: { type: String, trim: true },
    excerpt: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    author: { type: String, trim: true },
  },
  { _id: true, timestamps: true },
);

const battalionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    emblemTitle: { type: String, trim: true },
    slogan: { type: String, trim: true },
    tradition: { type: String, trim: true },
    mission: { type: String, trim: true },
    stats: {
      established: { type: String, trim: true },
      highlight: { type: String, trim: true },
    },
    posts: { type: [postSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

battalionSchema.index({ order: 1 });

export const Battalion = mongoose.model("Battalion", battalionSchema);
