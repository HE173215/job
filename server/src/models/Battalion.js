import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    id: { type: String, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    date: { type: String, trim: true, maxlength: 50 },
    category: { type: String, trim: true, maxlength: 100 },
    excerpt: { type: String, trim: true, maxlength: 1000 },
    imageUrl: { type: String, trim: true, maxlength: 2048 },
    author: { type: String, trim: true, maxlength: 100 },
  },
  { _id: true, timestamps: true },
);

const battalionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    fullName: { type: String, required: true, trim: true, maxlength: 250 },
    emblemTitle: { type: String, trim: true, maxlength: 200 },
    slogan: { type: String, trim: true, maxlength: 300 },
    tradition: { type: String, trim: true, maxlength: 3000 },
    mission: { type: String, trim: true, maxlength: 3000 },
    stats: {
      established: { type: String, trim: true, maxlength: 200 },
      highlight: { type: String, trim: true, maxlength: 200 },
    },
    posts: {
      type: [postSchema],
      default: [],
      validate: { validator: (posts) => posts.length <= 200, message: "At most 200 posts are allowed" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

battalionSchema.index({ order: 1 });

export const Battalion = mongoose.model("Battalion", battalionSchema);
