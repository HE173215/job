import { newsService } from "../services/newsService.js";

export const listPublishedNews = async (req, res) => {
  const result = await newsService.listPublished(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getPublishedNews = async (req, res) => {
  const data = await newsService.getPublishedBySlug(req.params.slug);
  res.status(200).json({ success: true, data });
};

export const listAdminNews = async (req, res) => {
  const result = await newsService.listAdmin(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getAdminNews = async (req, res) => {
  const data = await newsService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createNews = async (req, res) => {
  const data = await newsService.create(req.validated.body, req.user._id);
  res.status(201).json({ success: true, message: "News article created", data });
};

export const updateNews = async (req, res) => {
  const data = await newsService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "News article updated", data });
};

export const deleteNews = async (req, res) => {
  await newsService.remove(req.params.id);
  res.status(200).json({ success: true, message: "News article deleted", data: null });
};
