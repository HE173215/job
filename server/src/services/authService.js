import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

const TOKEN_TTL_SECONDS = 8 * 60 * 60;

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const authService = {
  async login({ username, password }) {
    const user = await User.findOne({ username }).select("+password +tokenVersion");

    if (!user || !(await user.verifyPassword(password))) {
      throw new AppError(401, "Invalid username or password");
    }
    if (!user.active) throw new AppError(403, "Account is inactive");

    const token = jwt.sign({ ver: user.tokenVersion ?? 0 }, env.jwtSecret, {
      algorithm: "HS256",
      subject: user.id,
      issuer: "political-officer-school-api",
      audience: "political-officer-school-admin",
      expiresIn: TOKEN_TTL_SECONDS,
    });

    return { token, user: safeUser(user), maxAge: TOKEN_TTL_SECONDS * 1000 };
  },

  getSafeUser: safeUser,
};
