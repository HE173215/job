import { activityService } from "../services/activityService.js";

export const listPublishedActivities = async (req, res) => {
  const result = await activityService.listPublished(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getPublishedActivity = async (req, res) => {
  const data = await activityService.getPublishedBySlug(req.params.slug);
  res.status(200).json({ success: true, data });
};

export const listAdminActivities = async (req, res) => {
  const result = await activityService.listAdmin(req.validated);
  res.status(200).json({ success: true, ...result });
};

export const getAdminActivity = async (req, res) => {
  const data = await activityService.getById(req.params.id);
  res.status(200).json({ success: true, data });
};

export const createActivity = async (req, res) => {
  const data = await activityService.create(req.validated.body);
  res.status(201).json({ success: true, message: "Activity created", data });
};

export const updateActivity = async (req, res) => {
  const data = await activityService.update(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Activity updated", data });
};

export const deleteActivity = async (req, res) => {
  await activityService.remove(req.params.id);
  res.status(200).json({ success: true, message: "Activity deleted", data: null });
};
