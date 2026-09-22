import { Introduction } from "../models/Introduction.js";

export const DEFAULT_INTRODUCTION_CONTENT = Object.freeze({
  badge: "CƠ CẤU & TỔ CHỨC",
  title: "GIỚI THIỆU TRƯỜNG SĨ QUAN CHÍNH TRỊ",
  subtitle:
    "Tổng quan về vị thế, chức năng nhiệm vụ và hệ thống các khoa giáo viên, đơn vị trực thuộc.",
  functionTitle: "Chức năng & Nhiệm vụ",
  functionParagraphs: [
    "Trường Sĩ quan Chính trị là trung tâm giáo dục, đào tạo sĩ quan chính trị cấp phân đội; đào tạo giáo viên khoa học xã hội và nhân văn quân sự bậc đại học và sau đại học; bồi dưỡng cán bộ chính trị và nghiên cứu khoa học lý luận chính trị phục vụ quân đội.",
    "Nhà trường chịu sự lãnh đạo trực tiếp của Quân ủy Trung ương, sự chỉ đạo của Bộ Quốc phòng và hướng dẫn của Tổng cục Chính trị Quân đội nhân dân Việt Nam.",
  ],
  trainingTitle: "Mục tiêu đào tạo",
  trainingParagraphs: [
    "Xây dựng đội ngũ sĩ quan chính trị có phẩm chất chính trị kiên định, tuyệt đối trung thành với Tổ quốc; có kiến thức toàn diện về khoa học quân sự, khoa học xã hội nhân văn; nắm vững nguyên tắc, phương pháp tiến hành công tác đảng, công tác chính trị trong quân đội.",
    "Chuẩn đầu ra đáp ứng yêu cầu người chỉ trị viên phân đội mẫu mực, người thầy mẫu mực, người đồng chí chân thành.",
  ],
  notice:
    "[Ghi chú quy chuẩn]: Danh mục ban giám hiệu, biểu đồ tổ chức chi tiết đang được cập nhật chính thức từ cơ quan văn thư Nhà trường.",
});

const withoutMetadata = (document) => {
  if (!document) return { ...DEFAULT_INTRODUCTION_CONTENT };
  return {
    badge: document.badge,
    title: document.title,
    subtitle: document.subtitle,
    functionTitle: document.functionTitle,
    functionParagraphs: document.functionParagraphs,
    trainingTitle: document.trainingTitle,
    trainingParagraphs: document.trainingParagraphs,
    notice: document.notice,
  };
};

export const introductionService = {
  async get() {
    const document = await Introduction.findOne({ contentKey: "main" }).lean();
    return withoutMetadata(document);
  },

  async update(data) {
    const document = await Introduction.findOneAndUpdate(
      { contentKey: "main" },
      { $set: data, $setOnInsert: { contentKey: "main" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();
    return withoutMetadata(document);
  },
};
