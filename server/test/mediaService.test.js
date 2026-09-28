import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

test("Cloudinary signature binds folder, formats, timestamp and upload preset", async () => {
  process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
  process.env.CLOUDINARY_API_KEY = "test-key";
  process.env.CLOUDINARY_API_SECRET = "test-secret";
  process.env.CLOUDINARY_UPLOAD_PRESET = "cms-images";
  const { mediaService } = await import("../src/services/mediaService.js");

  const result = mediaService.createUploadSignature("news", 1_700_000_000_000);
  const expected = createHash("sha1")
    .update("allowed_formats=jpg,jpeg,png,webp,avif&folder=political-officer-school/news&timestamp=1700000000&upload_preset=cms-imagestest-secret")
    .digest("hex");

  assert.deepEqual(result, {
    timestamp: 1_700_000_000,
    signature: expected,
    apiKey: "test-key",
    cloudName: "test-cloud",
    folder: "political-officer-school/news",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    maxBytes: 10 * 1024 * 1024,
    uploadPreset: "cms-images",
  });
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
});

test("removed application assets are deleted from Cloudinary", async () => {
  const { mediaService } = await import("../src/services/mediaService.js");
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true };
  };

  try {
    await mediaService.cleanupRemovedAssets(
      { thumbnail: { publicId: "political-officer-school/news/old-image" } },
      { thumbnail: null },
    );
    assert.match(request.url, /image\/destroy$/);
    assert.equal(request.options.body.get("public_id"), "political-officer-school/news/old-image");
    assert.equal(request.options.body.has("signature"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
