import { Era } from "../models/Era.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

const DEFAULT_ERAS = [
  {
    slug: "giai-doan-1",
    name: "Giai đoạn I",
    timeframe: "1951 – 1975",
    title: "Thành lập & Kháng chiến giải phóng dân tộc",
    description:
      "Ngày 25/10/1951, Trường Chính trị Trung cấp Quân đội nhân dân Việt Nam được thành lập, đặt nền móng đào tạo cán bộ chính trị quân đội và chi viện đắc lực cho các chiến trường kháng chiến chống Pháp và chống Mỹ cứu nước.",
    quote: "Mỗi cán bộ chính trị là một ngọn cờ dẫn dắt tinh thần bộ đội.",
    startYear: 1951,
    endYear: 1975,
    order: 1,
  },
  {
    slug: "giai-doan-2",
    name: "Giai đoạn II",
    timeframe: "1976 – 1995",
    title: "Thành lập Trường SQCT & Xây dựng chính quy",
    description:
      "Ngày 14/01/1976, Trường Sĩ quan Chính trị được thành lập, đóng quân tại Thành cổ Bắc Ninh; khẳng định vị thế trường Đảng tập trung trong Quân đội, đào tạo chính trị viên phân đội mẫu mực.",
    quote: "Trung thành, kiên định, mẫu mực chính quy.",
    startYear: 1976,
    endYear: 1995,
    order: 2,
  },
  {
    slug: "giai-doan-3",
    name: "Giai đoạn III",
    timeframe: "1995 – 2008",
    title: "Hợp nhất & Kế thừa nhiệm vụ đào tạo",
    description:
      "Thời kỳ hợp nhất với Học viện Chính trị Quân sự, bộ phận Cơ sở II tiếp tục kiên trì thực hiện nhiệm vụ đào tạo sĩ quan chính trị cấp phân đội, giữ vững ngọn lửa nhiệt huyết và truyền thống vẻ vang.",
    quote: "Kế thừa và phát huy truyền thống anh hùng.",
    startYear: 1995,
    endYear: 2008,
    order: 3,
  },
  {
    slug: "giai-doan-4",
    name: "Giai đoạn IV",
    timeframe: "2008 – Nay",
    title: "Tái lập, Nâng cấp Đại học & Phát triển hiện đại",
    description:
      "Tái lập Trường Sĩ quan Chính trị (2008), Thủ tướng Chính phủ quyết định thành lập Trường Đại học Chính trị (2010), xây dựng cơ sở Thạch Hòa – Hà Nội khang trang, chính quy, chuẩn hóa, hiện đại.",
    quote: "Trung thành, sáng tạo, đoàn kết, vượt khó, dạy tốt, học tốt.",
    startYear: 2008,
    endYear: 9999,
    order: 4,
  },
];

export const eraService = {
  async ensureSeeded() {
    const count = await Era.countDocuments();
    if (count === 0) {
      await Era.insertMany(DEFAULT_ERAS);
    }
  },

  async listPublished() {
    await this.ensureSeeded();
    return Era.find().sort({ order: 1, startYear: 1 }).select("-__v").lean();
  },

  async listAdmin(query = {}) {
    await this.ensureSeeded();
    const filter = {};
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [{ name: pattern }, { title: pattern }, { timeframe: pattern }];
    }
    return Era.find(filter).sort({ order: 1, startYear: 1 }).select("-__v").lean();
  },

  async getById(idOrSlug) {
    await this.ensureSeeded();
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

    if (data.slug) {
      const existing = await Era.findOne({
        slug: data.slug,
        ...(isId ? { _id: { $ne: idOrSlug } } : { slug: { $ne: idOrSlug } }),
      });
      if (existing) {
        throw new AppError(409, `Giai đoạn với mã '${data.slug}' đã tồn tại`);
      }
    }

    const era = await Era.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .lean();

    if (!era) throw new AppError(404, "Giai đoạn lịch sử không tồn tại");
    return era;
  },

  async remove(idOrSlug) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const filter = isId ? { _id: idOrSlug } : { slug: idOrSlug };

    const era = await Era.findOneAndDelete(filter).select("-__v").lean();
    if (!era) throw new AppError(404, "Giai đoạn lịch sử không tồn tại");
    return era;
  },

  async resetDefaults() {
    await Era.deleteMany({});
    const created = await Era.insertMany(DEFAULT_ERAS);
    return created.map((e) => e.toObject({ versionKey: false }));
  },
};
