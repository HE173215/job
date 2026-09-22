import mongoose from "mongoose";

const introductionSchema = new mongoose.Schema(
  {
    contentKey: {
      type: String,
      default: "main",
      enum: ["main"],
      unique: true,
      immutable: true,
    },
    badge: { type: String, required: true, trim: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    subtitle: { type: String, required: true, trim: true, maxlength: 1000 },
    functionTitle: { type: String, required: true, trim: true, maxlength: 200 },
    functionParagraphs: {
      type: [{ type: String, trim: true, maxlength: 5000 }],
      required: true,
      validate: {
        validator: (value) => value.length >= 1 && value.length <= 10,
        message: "Function content must contain between 1 and 10 paragraphs",
      },
    },
    trainingTitle: { type: String, required: true, trim: true, maxlength: 200 },
    trainingParagraphs: {
      type: [{ type: String, trim: true, maxlength: 5000 }],
      required: true,
      validate: {
        validator: (value) => value.length >= 1 && value.length <= 10,
        message: "Training content must contain between 1 and 10 paragraphs",
      },
    },
    notice: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const Introduction = mongoose.model("Introduction", introductionSchema);
