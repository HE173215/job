import { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";

export const validateMediaSignature = (req, _res, next) => {
  const folder = req.body?.folder;

  if (typeof folder !== "string" || !CLOUDINARY_FOLDERS[folder]) {
    return next(
      new AppError(422, "Validation failed", [
        {
          field: "folder",
          message: `Must be one of: ${Object.keys(CLOUDINARY_FOLDERS).join(", ")}`,
        },
      ]),
    );
  }

  req.validated = { folder };
  return next();
};
