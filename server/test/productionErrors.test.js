import assert from "node:assert/strict";
import test from "node:test";

test("production errors hide internal messages and stack traces", async () => {
  process.env.NODE_ENV = "production";
  const { errorHandler } = await import("../src/middlewares/errorHandler.js");
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

  errorHandler(new Error("internal filesystem path"), {}, response, () => {});
  assert.equal(status, 500);
  assert.deepEqual(body, {
    success: false,
    message: "Internal server error",
    errors: [],
  });
});
