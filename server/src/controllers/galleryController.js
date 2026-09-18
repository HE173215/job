import { galleryService } from "../services/galleryService.js";

export const listPublishedGallery = async (req, res) => {
  const result = await galleryService.listPublished(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getPublishedGallery = async (req, res) => {
  const data = await galleryService.getPublishedBySlug(req.params.slug);
  res.status(200).json({ success: true, data });
};

export const listAdminGallery = async (req, res) => {
  const result = await galleryService.listAdmin(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getAdminGallery = async (req, res) => {
  const data = await galleryService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createGallery = async (req, res) => {
  const data = await galleryService.create(req.validated.body);
  res.status(201).json({ success: true, message: "Gallery album created", data });
};

export const updateGallery = async (req, res) => {
  const data = await galleryService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Gallery album updated", data });
};

export const deleteGallery = async (req, res) => {
  await galleryService.remove(req.params.id);
  res.status(200).json({ success: true, message: "Gallery album deleted", data: null });
};
