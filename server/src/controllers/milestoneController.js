import { milestoneService } from "../services/milestoneService.js";

export const listPublishedMilestones = async (req, res) => {
  const result = await milestoneService.listPublished(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getPublishedMilestone = async (req, res) => {
  const data = await milestoneService.getPublishedBySlug(req.params.slug);
  res.status(200).json({ success: true, data });
};

export const listAdminMilestones = async (req, res) => {
  const result = await milestoneService.listAdmin(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getAdminMilestone = async (req, res) => {
  const data = await milestoneService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createMilestone = async (req, res) => {
  const data = await milestoneService.create(req.validated.body);
  res.status(201).json({ success: true, message: "Milestone created", data });
};

export const updateMilestone = async (req, res) => {
  const data = await milestoneService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Milestone updated", data });
};

export const deleteMilestone = async (req, res) => {
  await milestoneService.remove(req.params.id);
  res.status(200).json({ success: true, message: "Milestone deleted", data: null });
};
