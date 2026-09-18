import { Milestone } from "../models/Milestone.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

const buildFilter = ({ era, featured, published, search }, publicOnly) => {
  const filter = publicOnly ? { published: true } : {};

  if (era) filter.era = era;
  if (featured !== undefined) filter.featured = featured;
  if (!publicOnly && published !== undefined) filter.published = published;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { summary: pattern }, { era: pattern }];
  }

  return filter;
};

const list = async (query, publicOnly) => {
  const { page, limit, sort } = query;
  const filter = buildFilter(query, publicOnly);
  const [data, total] = await Promise.all([
    Milestone.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean(),
    Milestone.countDocuments(filter),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const milestoneService = {
  listPublished: (query) => list(query, true),
  listAdmin: (query) => list(query, false),

  async getPublishedBySlug(slug) {
    const milestone = await Milestone.findOne({ slug, published: true }).select("-__v").lean();
    if (!milestone) throw new AppError(404, "Milestone not found");
    return milestone;
  },

  async getById(id) {
    const milestone = await Milestone.findById(id).select("-__v").lean();
    if (!milestone) throw new AppError(404, "Milestone not found");
    return milestone;
  },

  async create(data) {
    const milestone = await Milestone.create(data);
    return milestone.toObject({ versionKey: false });
  },

  async update(id, data) {
    const milestone = await Milestone.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .lean();
    if (!milestone) throw new AppError(404, "Milestone not found");
    return milestone;
  },

  async remove(id) {
    const milestone = await Milestone.findByIdAndDelete(id).select("_id").lean();
    if (!milestone) throw new AppError(404, "Milestone not found");
  },
};
