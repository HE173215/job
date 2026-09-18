import mongoose from "mongoose";
import { hashPassword, verifyPassword } from "../utils/password.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-z0-9._-]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 12,
      maxlength: 256,
    },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashChangedPassword() {
  if (this.isModified("password")) this.password = await hashPassword(this.password);
});

userSchema.methods.verifyPassword = function verify(candidate) {
  return verifyPassword(candidate, this.password);
};

userSchema.set("toJSON", {
  transform: (_document, result) => {
    delete result.password;
    delete result.__v;
    return result;
  },
});

export const User = mongoose.model("User", userSchema);
