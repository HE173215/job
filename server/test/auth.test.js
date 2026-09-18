import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";
import { authenticate } from "../src/middlewares/auth.js";
import { User } from "../src/models/User.js";
import { authService } from "../src/services/authService.js";

const runMiddleware = (middleware, req) =>
  new Promise((resolve, reject) => {
    Promise.resolve(middleware(req, {}, (error) => resolve(error))).catch(reject);
  });

test("login returns a signed token and never returns the password", async () => {
  const originalFindOne = User.findOne;
  const user = {
    _id: "507f1f77bcf86cd799439011",
    id: "507f1f77bcf86cd799439011",
    name: "CMS Administrator",
    username: "admin",
    email: "admin@example.invalid",
    role: "admin",
    active: true,
    password: "must-not-leak",
    verifyPassword: async () => true,
  };
  User.findOne = () => ({ select: async () => user });

  try {
    const result = await authService.login({ username: "admin", password: "valid-password" });
    assert.equal(typeof result.token, "string");
    assert.equal("password" in result.user, false);
    assert.equal(jwt.decode(result.token).sub, user.id);
  } finally {
    User.findOne = originalFindOne;
  }
});

test("authenticate verifies the cookie and reloads the active user", async () => {
  const originalFindById = User.findById;
  const user = {
    _id: "507f1f77bcf86cd799439011",
    role: "editor",
    active: true,
  };
  User.findById = () => ({ select: async () => user });
  const token = jwt.sign({}, env.jwtSecret, {
    algorithm: "HS256",
    subject: user._id,
    issuer: "political-officer-school-api",
    audience: "political-officer-school-admin",
    expiresIn: 60,
  });
  const req = { cookies: { token } };

  try {
    assert.equal(await runMiddleware(authenticate, req), undefined);
    assert.equal(req.user, user);
  } finally {
    User.findById = originalFindById;
  }
});
