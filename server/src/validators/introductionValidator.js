import {
  addError,
  validateBodyShape,
  validateString,
  validationError,
} from "./commonValidator.js";

const ALLOWED_FIELDS = new Set([
  "badge",
  "title",
  "subtitle",
  "functionTitle",
  "functionParagraphs",
  "trainingTitle",
  "trainingParagraphs",
  "notice",
]);

const REQUIRED_FIELDS = [...ALLOWED_FIELDS];

const validateParagraphs = (errors, body, field) => {
  const paragraphs = body[field];
  if (!Array.isArray(paragraphs)) {
    errors.push({ field, message: "Must be an array" });
    return;
  }

  addError(errors, field, paragraphs.length < 1 || paragraphs.length > 10, "Must contain 1 to 10 paragraphs");
  paragraphs.forEach((paragraph, index) => {
    addError(
      errors,
      `${field}.${index}`,
      typeof paragraph !== "string" || !paragraph.trim() || paragraph.length > 5000,
      "Must be a non-empty string up to 5000 characters",
    );
  });
};

export const validateIntroduction = (req, _res, next) => {
  const body = req.body;
  const errors = [];
  if (!validateBodyShape(body, ALLOWED_FIELDS, REQUIRED_FIELDS, false, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "badge", 100, { nonEmpty: true });
  validateString(errors, body, "title", 300, { nonEmpty: true });
  validateString(errors, body, "subtitle", 1000, { nonEmpty: true });
  validateString(errors, body, "functionTitle", 200, { nonEmpty: true });
  validateParagraphs(errors, body, "functionParagraphs");
  validateString(errors, body, "trainingTitle", 200, { nonEmpty: true });
  validateParagraphs(errors, body, "trainingParagraphs");
  validateString(errors, body, "notice", 2000, { nonEmpty: true });

  if (errors.length) return next(validationError(errors));
  req.validated = {
    body: {
      ...body,
      badge: body.badge.trim(),
      title: body.title.trim(),
      subtitle: body.subtitle.trim(),
      functionTitle: body.functionTitle.trim(),
      functionParagraphs: body.functionParagraphs.map((paragraph) => paragraph.trim()),
      trainingTitle: body.trainingTitle.trim(),
      trainingParagraphs: body.trainingParagraphs.map((paragraph) => paragraph.trim()),
      notice: body.notice.trim(),
    },
  };
  return next();
};
