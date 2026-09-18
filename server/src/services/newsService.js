import { News } from "../models/News.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

const buildFilter = ({ category, featured, published, search }, publicOnly) => {
  const filter = publicOnly ? { published: true } : {};
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured;
  if (!publicOnly && published !== undefined) filter.published = published;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { excerpt: pattern }, { tags: pattern }];
  }
  return filter;
};

const list = async (query, publicOnly) => {
  const { page, limit } = query;
  const filter = buildFilter(query, publicOnly);
  const [data, total] = await Promise.all([
    News.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean(),
    News.countDocuments(filter),
  ]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const newsService = {
  listPublished: (query) => list(query, true),
  listAdmin: (query) => list(query, false),

  async getPublishedBySlug(slug) {
    const news = await News.findOne({ slug, published: true }).select("-__v").lean();
    if (!news) throw new AppError(404, "News article not found");
    return news;
  },

  async getById(id) {
    const news = await News.findById(id).select("-__v").lean();
    if (!news) throw new AppError(404, "News article not found");
    return news;
  },

  async create(data, author) {
    const input = { ...data, author };
    if (input.published && !input.publishedAt) input.publishedAt = new Date();
    const news = await News.create(input);
    return news.toObject({ versionKey: false });
  },

  async update(id, data) {
    const update = { ...data };
    if (update.published === true && update.publishedAt == null) {
      const existing = await News.findById(id).select("publishedAt").lean();
      if (!existing) throw new AppError(404, "News article not found");
      if (update.publishedAt === null || !existing.publishedAt) {
        update.publishedAt = new Date();
      }
    }

    const news = await News.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select("-__v")
      .lean();
    if (!news) throw new AppError(404, "News article not found");
    return news;
  },

  async remove(id) {
    const news = await News.findByIdAndDelete(id).select("_id").lean();
    if (!news) throw new AppError(404, "News article not found");
  },
};
