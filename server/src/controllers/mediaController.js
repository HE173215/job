import { mediaService } from "../services/mediaService.js";

export const createUploadSignature = (req, res) => {
  const data = mediaService.createUploadSignature(req.validated.folder);
  res.status(200).json({ success: true, data });
};
