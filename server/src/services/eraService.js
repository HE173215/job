import { Era } from "../models/Era.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

export const eraService = {
  async listPublished() {
    return Era.find().sort({ order: 1, startYear: 1 }).select("-__v").lean();
  },

  async listAdmin(query = {}) {
    const filter = {};
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [{ name: pattern }, { title: pattern }, { timeframe: pattern }];
    }
    return Era.find(filter).sort({ order: 1, startYear: 1 }).select("-__v").lean();
  },

  async getById(idOrSlug) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const era = isId
      ? await Era.findById(idOrSlug).select("-__v").lean()
      : await Era.findOne({ slug: idOrSlug }).select("-__v").lean();

    if (!era) throw new AppError(404, "Giai đoạn lịch sử không tồn tại");
    return era;
  },

  async create(data) {
    if (!data.slug) {
      data.slug = (data.name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    const existing = await Era.findOne({ slug: data.slug });
    if (existing) {
      throw new AppError(409, `Giai đoạn với mã '${data.slug}' đã tồn tại`);
    }

    const era = await Era.create(data);
    return era.toObject({ versionKey: false });
  },

  async update(idOrSlug, data) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const filter = isId ? { _id: idOrSlug } : { slug: idOrSlug };
    const era = await Era.findOne(filter);
    if (!era) throw new AppError(404, "Giai đoạn lịch sử không tồn tại");

    if (data.slug) {
      const existing = await Era.findOne({
        slug: data.slug,
        ...(isId ? { _id: { $ne: idOrSlug } } : { slug: { $ne: idOrSlug } }),
      });
      if (existing) {
        throw new AppError(409, `Giai đoạn với mã '${data.slug}' đã tồn tại`);
      }
    }

    const startYear = data.startYear ?? era.startYear;
    const endYear = data.endYear ?? era.endYear;
    if (endYear < startYear) {
      throw new AppError(422, "Validation failed", [
        { field: "endYear", message: "Must not be before startYear" },
      ]);
    }

    Object.assign(era, data);
    await era.save();
    return era.toObject({ versionKey: false });
  },

  async remove(idOrSlug) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const filter = isId ? { _id: idOrSlug } : { slug: idOrSlug };

    const era = await Era.findOneAndDelete(filter).select("-__v").lean();
    if (!era) throw new AppError(404, "Giai đoạn lịch sử không tồn tại");
    return era;
  },
};
