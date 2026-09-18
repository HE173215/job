import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { validateObjectId } from "../src/validators/commonValidator.js";
import { validateMediaSignature } from "../src/validators/mediaValidator.js";

const runMiddleware = (middleware, req) =>
  new Promise((resolve) => middleware(req, {}, (error) => resolve(error)));

test("invalid ObjectId and arbitrary Cloudinary folders are rejected", async () => {
  const idError = await runMiddleware(validateObjectId, { params: { id: "not-an-id" } });
  assert.equal(idError.statusCode, 422);

  const folderError = await runMiddleware(validateMediaSignature, {
    body: { folder: "user-controlled/path" },
  });
  assert.equal(folderError.statusCode, 422);
});

test("duplicate keys become a safe 409 response", () => {
  let status;
  let body;
  const response = {
    status(value) {
      status = value;
      return this;
    },
    json(value) {
      body = value;
    },
  };

  errorHandler({ code: 11000, keyPattern: { slug: 1 } }, {}, response, () => {});
  assert.equal(status, 409);
  assert.equal(body.success, false);
  assert.deepEqual(body.errors, [{ field: "slug", message: "Must be unique" }]);
});

test("auth and every admin CMS route are mounted and protected", async () => {
  const { app } = await import("../src/app.js");
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const login = await fetch(`${base}/api/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.equal(login.status, 422);

    const me = await fetch(`${base}/api/v1/auth/me`);
    assert.equal(me.status, 401);

    const adminRoutes = [
      ["POST", "/api/v1/admin/media/signature"],
      ["GET", "/api/v1/admin/milestones"],
      ["GET", "/api/v1/admin/milestones/507f1f77bcf86cd799439011"],
      ["POST", "/api/v1/admin/milestones"],
      ["PATCH", "/api/v1/admin/milestones/507f1f77bcf86cd799439011"],
      ["DELETE", "/api/v1/admin/milestones/507f1f77bcf86cd799439011"],
      ["GET", "/api/v1/admin/news"],
      ["GET", "/api/v1/admin/news/507f1f77bcf86cd799439011"],
      ["POST", "/api/v1/admin/news"],
      ["PATCH", "/api/v1/admin/news/507f1f77bcf86cd799439011"],
      ["DELETE", "/api/v1/admin/news/507f1f77bcf86cd799439011"],
      ["GET", "/api/v1/admin/activities"],
      ["GET", "/api/v1/admin/activities/507f1f77bcf86cd799439011"],
      ["POST", "/api/v1/admin/activities"],
      ["PATCH", "/api/v1/admin/activities/507f1f77bcf86cd799439011"],
      ["DELETE", "/api/v1/admin/activities/507f1f77bcf86cd799439011"],
      ["GET", "/api/v1/admin/gallery"],
      ["GET", "/api/v1/admin/gallery/507f1f77bcf86cd799439011"],
      ["POST", "/api/v1/admin/gallery"],
      ["PATCH", "/api/v1/admin/gallery/507f1f77bcf86cd799439011"],
      ["DELETE", "/api/v1/admin/gallery/507f1f77bcf86cd799439011"],
    ];

    for (const [method, path] of adminRoutes) {
      const response = await fetch(`${base}${path}`, {
        method,
        headers: { "content-type": "application/json" },
        body: ["POST", "PATCH"].includes(method) ? "{}" : undefined,
      });
      assert.equal(response.status, 401, `${method} ${path}`);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
