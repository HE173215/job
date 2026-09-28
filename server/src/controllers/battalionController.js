import { battalionService } from "../services/battalionService.js";

export const listPublishedBattalions = async (_req, res) => {
  const data = await battalionService.listPublished();
  res.status(200).json({ success: true, data });
};

export const getPublishedBattalion = async (req, res) => {
  const data = await battalionService.getByCodeOrId(req.params.id);
  res.status(200).json({ success: true, data });
};

export const listAdminBattalions = async (req, res) => {
  const data = await battalionService.listAdmin(req.validated);
  res.status(200).json({ success: true, data });
};

export const getAdminBattalion = async (req, res) => {
  const data = await battalionService.getByCodeOrId(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createBattalion = async (req, res) => {
  const data = await battalionService.create(req.validated.body);
  res.status(201).json({ success: true, message: "Đơn vị Tiểu đoàn đã được tạo", data });
};

export const updateBattalion = async (req, res) => {
  const data = await battalionService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Đơn vị Tiểu đoàn đã được cập nhật", data });
};

export const deleteBattalion = async (req, res) => {
  await battalionService.remove(req.params.id);
  res.status(200).json({ success: true, message: "Đơn vị Tiểu đoàn đã được xóa", data: null });
};

export const addBattalionPost = async (req, res) => {
  const data = await battalionService.addPost(req.params.id, req.validated.body);
  res.status(201).json({ success: true, message: "Đã thêm bài viết cho tiểu đoàn", data });
};

export const deleteBattalionPost = async (req, res) => {
  const data = await battalionService.removePost(req.params.id, req.params.postId);
  res.status(200).json({ success: true, message: "Đã xóa bài viết của tiểu đoàn", data });
};
