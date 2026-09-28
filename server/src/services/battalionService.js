import { Battalion } from "../models/Battalion.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

const sanitizePosts = (posts) => {
  if (!Array.isArray(posts)) return posts;
  return posts.map((post) => {
    if (!post || typeof post !== "object") return post;
    const clean = { ...post };
    if (clean._id && !/^[0-9a-fA-F]{24}$/.test(String(clean._id))) {
      delete clean._id;
    }
    return clean;
  });
};

export const battalionService = {
  async listPublished() {
    return Battalion.find().sort({ order: 1 }).select("-__v").lean();
  },

  async listAdmin(query = {}) {
    const filter = {};
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [
        { name: pattern },
        { fullName: pattern },
        { code: pattern },
        { emblemTitle: pattern },
      ];
    }
    return Battalion.find(filter).sort({ order: 1 }).select("-__v").lean();
  },

  async getByCodeOrId(identifier) {
    const isId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const item = isId
      ? await Battalion.findById(identifier).select("-__v").lean()
      : await Battalion.findOne({ code: identifier.toLowerCase() })
          .select("-__v")
          .lean();

    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async create(data) {
    if (!data.code) {
      data.code = (data.name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    const existing = await Battalion.findOne({ code: data.code.toLowerCase() });
    if (existing) {
      throw new AppError(409, `Mã tiểu đoàn '${data.code}' đã tồn tại`);
    }

    if (data.posts) {
      data.posts = sanitizePosts(data.posts);
    }

    const item = await Battalion.create(data);
    return item.toObject({ versionKey: false });
  },

  async update(idOrCode, data) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrCode);
    const filter = isId ? { _id: idOrCode } : { code: idOrCode.toLowerCase() };

    if (data.code) {
      const existing = await Battalion.findOne({
        code: data.code.toLowerCase(),
        ...(isId
          ? { _id: { $ne: idOrCode } }
          : { code: { $ne: idOrCode.toLowerCase() } }),
      });
      if (existing) {
        throw new AppError(409, `Mã tiểu đoàn '${data.code}' đã tồn tại`);
      }
    }

    if (data.posts) {
      data.posts = sanitizePosts(data.posts);
    }

    const item = await Battalion.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .lean();

    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async remove(idOrCode) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrCode);
    const filter = isId ? { _id: idOrCode } : { code: idOrCode.toLowerCase() };
    const item = await Battalion.findOneAndDelete(filter).select("-__v").lean();
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async addPost(id, postData) {
    const item = await Battalion.findById(id);
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");

    const clean = { ...postData };
    if (clean._id && !/^[0-9a-fA-F]{24}$/.test(String(clean._id))) {
      delete clean._id;
    }

    item.posts.unshift(clean);
    await item.save();
    return item.toObject({ versionKey: false });
  },

  async removePost(id, postId) {
    const item = await Battalion.findById(id);
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");

    item.posts = item.posts.filter((p) => p._id.toString() !== postId);
    await item.save();
    return item.toObject({ versionKey: false });
  },
};
