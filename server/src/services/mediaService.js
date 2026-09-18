import { createHash } from "node:crypto";
import { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";
import { env } from "../config/env.js";

export const mediaService = {
  createUploadSignature(folderKey, now = Date.now()) {
    const folder = CLOUDINARY_FOLDERS[folderKey];
    const timestamp = Math.floor(now / 1000);
    const signedParameters = `folder=${folder}&timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(`${signedParameters}${env.cloudinaryApiSecret}`)
      .digest("hex");

    return {
      timestamp,
      signature,
      apiKey: env.cloudinaryApiKey,
      cloudName: env.cloudinaryCloudName,
      folder,
    };
  },
};
