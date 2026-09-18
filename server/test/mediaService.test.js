import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

test("Cloudinary signature uses only mapped folder and timestamp", async () => {
  process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
  process.env.CLOUDINARY_API_KEY = "test-key";
  process.env.CLOUDINARY_API_SECRET = "test-secret";
  const { mediaService } = await import("../src/services/mediaService.js");

  const result = mediaService.createUploadSignature("news", 1_700_000_000_000);
  const expected = createHash("sha1")
    .update("folder=political-officer-school/news&timestamp=1700000000test-secret")
    .digest("hex");

  assert.deepEqual(result, {
    timestamp: 1_700_000_000,
    signature: expected,
    apiKey: "test-key",
    cloudName: "test-cloud",
    folder: "political-officer-school/news",
  });
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
});
