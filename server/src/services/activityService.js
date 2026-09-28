import { Activity } from "../models/Activity.js";
import { AppError } from "../utils/AppError.js";
import { mediaService } from "./mediaService.js";

const buildFilter = ({ featured, published }, publicOnly) => {
  const filter = publicOnly ? { published: true } : {};
  if (featured !== undefined) filter.featured = featured;
  if (!publicOnly && published !== undefined) filter.published = published;
  return filter;
};

const list = async (query, publicOnly) => {
  const { page, limit } = query;
  const filter = buildFilter(query, publicOnly);
  const [data, total] = await Promise.all([
    Activity.find(filter)
      .sort({ order: 1, startDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean(),
    Activity.countDocuments(filter),
  ]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const assertDateOrder = (startDate, endDate) => {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new AppError(422, "Validation failed", [
      { field: "endDate", message: "Must not be before startDate" },
    ]);
  }
};

export const activityService = {
  listPublished: (query) => list(query, true),
  listAdmin: (query) => list(query, false),

  async getPublishedBySlug(slug) {
    const activity = await Activity.findOne({ slug, published: true }).select("-__v").lean();
    if (!activity) throw new AppError(404, "Activity not found");
    return activity;
  },

  async getById(id) {
    const activity = await Activity.findById(id).select("-__v").lean();
    if (!activity) throw new AppError(404, "Activity not found");
    return activity;
  },

  async create(data) {
    assertDateOrder(data.startDate, data.endDate);
    const activity = await Activity.create(data);
    return activity.toObject({ versionKey: false });
  },

  async update(id, data) {
    const activity = await Activity.findById(id);
    if (!activity) throw new AppError(404, "Activity not found");
    const existing = activity.toObject({ versionKey: false });

    const startDate = data.startDate !== undefined ? data.startDate : activity.startDate;
    const endDate = data.endDate !== undefined ? data.endDate : activity.endDate;
    assertDateOrder(startDate, endDate);
    Object.assign(activity, data);
    await activity.save();
    const updated = activity.toObject({ versionKey: false });
    void mediaService.cleanupRemovedAssets(existing, updated);
    return updated;
  },

  async remove(id) {
    const activity = await Activity.findByIdAndDelete(id).select("-__v").lean();
    if (!activity) throw new AppError(404, "Activity not found");
    void mediaService.cleanupRemovedAssets(activity);
  },
};
