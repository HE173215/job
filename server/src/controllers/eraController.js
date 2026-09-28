import { eraService } from "../services/eraService.js";

export const listPublishedEras = async (_req, res) => {
  const data = await eraService.listPublished();
  res.status(200).json({ success: true, data });
};

export const getPublishedEra = async (req, res) => {
  const data = await eraService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const listAdminEras = async (req, res) => {
  const data = await eraService.listAdmin(req.validated);
  res.status(200).json({ success: true, data });
};

export const getAdminEra = async (req, res) => {
  const data = await eraService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createEra = async (req, res) => {
  const data = await eraService.create(req.validated.body);
  res.status(201).json({ success: true, message: "Giai đoạn đã được tạo", data });
};

export const updateEra = async (req, res) => {
  const data = await eraService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Giai đoạn đã được cập nhật", data });
};

export const deleteEra = async (req, res) => {
  await eraService.remove(req.params.id);
  res.status(200).json({ success: true, message: "Giai đoạn đã được xóa", data: null });
};
