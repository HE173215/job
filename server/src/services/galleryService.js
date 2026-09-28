import { GalleryAlbum } from "../models/GalleryAlbum.js";
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
    GalleryAlbum.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean(),
    GalleryAlbum.countDocuments(filter),
  ]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const galleryService = {
  listPublished: (query) => list(query, true),
  listAdmin: (query) => list(query, false),

  async getPublishedBySlug(slug) {
    const album = await GalleryAlbum.findOne({ slug, published: true }).select("-__v").lean();
    if (!album) throw new AppError(404, "Gallery album not found");
    return album;
  },

  async getById(id) {
    const album = await GalleryAlbum.findById(id).select("-__v").lean();
    if (!album) throw new AppError(404, "Gallery album not found");
    return album;
  },

  async create(data) {
    const album = await GalleryAlbum.create(data);
    return album.toObject({ versionKey: false });
  },

  async update(id, data) {
    const existing = await GalleryAlbum.findById(id).select("-__v").lean();
    if (!existing) throw new AppError(404, "Gallery album not found");
    const album = await GalleryAlbum.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select("-__v")
      .lean();
    if (!album) throw new AppError(404, "Gallery album not found");
    void mediaService.cleanupRemovedAssets(existing, album);
    return album;
  },

  async remove(id) {
    const album = await GalleryAlbum.findByIdAndDelete(id).select("-__v").lean();
    if (!album) throw new AppError(404, "Gallery album not found");
    void mediaService.cleanupRemovedAssets(album);
  },
};
