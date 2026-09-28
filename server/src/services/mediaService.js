import { createHash } from "node:crypto";
import {
  CLOUDINARY_ALLOWED_FORMATS,
  CLOUDINARY_FOLDERS,
  CLOUDINARY_MAX_IMAGE_BYTES,
  CLOUDINARY_ROOT_FOLDER,
} from "../config/cloudinary.js";
import { env } from "../config/env.js";

const signParameters = (parameters) => {
  const serialized = Object.entries(parameters)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1")
    .update(`${serialized}${env.cloudinaryApiSecret}`)
    .digest("hex");
};

const collectPublicIds = (value, output = new Set()) => {
  if (!value || typeof value !== "object") return output;
  if (typeof value.publicId === "string" && value.publicId.startsWith(CLOUDINARY_ROOT_FOLDER)) {
    output.add(value.publicId);
  }
  for (const nested of Object.values(value)) collectPublicIds(nested, output);
  return output;
};

export const mediaService = {
  createUploadSignature(folderKey, now = Date.now()) {
    const folder = CLOUDINARY_FOLDERS[folderKey];
    const timestamp = Math.floor(now / 1000);
    const parameters = {
      allowed_formats: CLOUDINARY_ALLOWED_FORMATS.join(","),
      folder,
      timestamp,
      ...(env.cloudinaryUploadPreset ? { upload_preset: env.cloudinaryUploadPreset } : {}),
    };
    const signature = signParameters(parameters);

    return {
      timestamp,
      signature,
      apiKey: env.cloudinaryApiKey,
      cloudName: env.cloudinaryCloudName,
      folder,
      allowedFormats: CLOUDINARY_ALLOWED_FORMATS,
      maxBytes: CLOUDINARY_MAX_IMAGE_BYTES,
      uploadPreset: env.cloudinaryUploadPreset,
    };
  },

  async deleteAsset(publicId, now = Date.now()) {
    if (!publicId?.startsWith(CLOUDINARY_ROOT_FOLDER)) return;
    const timestamp = Math.floor(now / 1000);
    const parameters = { invalidate: "true", public_id: publicId, timestamp };
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/destroy`,
      {
        method: "POST",
        body: new URLSearchParams({
          ...parameters,
          api_key: env.cloudinaryApiKey,
          signature: signParameters(parameters),
        }),
      },
    );
    if (!response.ok) throw new Error(`Cloudinary deletion failed with status ${response.status}`);
  },

  async cleanupRemovedAssets(previous, current = null) {
    const previousIds = collectPublicIds(previous);
    const currentIds = collectPublicIds(current);
    const removed = [...previousIds].filter((publicId) => !currentIds.has(publicId));
    const results = await Promise.allSettled(removed.map((publicId) => this.deleteAsset(publicId)));
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(JSON.stringify({
          event: "cloudinary_cleanup_failed",
          publicId: removed[index],
          message: result.reason?.message ?? String(result.reason),
        }));
      }
    });
  },
};
