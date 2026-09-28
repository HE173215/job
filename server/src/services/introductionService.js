import { Introduction } from "../models/Introduction.js";

export const DEFAULT_INTRODUCTION_CONTENT = Object.freeze({
  badge: "[Đang cập nhật]",
  title: "[Đang cập nhật]",
  subtitle: "Nội dung đang chờ được phê duyệt và cập nhật chính thức.",
  functionTitle: "[Đang cập nhật]",
  functionParagraphs: ["Nội dung đang chờ được phê duyệt và cập nhật chính thức."],
  trainingTitle: "[Đang cập nhật]",
  trainingParagraphs: ["Nội dung đang chờ được phê duyệt và cập nhật chính thức."],
  notice: "[Đang cập nhật]",
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
