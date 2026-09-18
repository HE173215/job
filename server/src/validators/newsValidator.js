import {
  addError,
  readListQuery,
  sanitizeRichText,
  validateBodyShape,
  validateBooleanFields,
  validateDateField,
  validateImage,
  validateObjectId,
  validateSlugField,
  validateSlugParam,
  validateString,
  validationError,
} from "./commonValidator.js";

const ALLOWED_FIELDS = new Set([
  "title", "slug", "excerpt", "content", "thumbnail", "category", "tags",
  "featured", "published", "publishedAt",
]);

export const validateNewsList = (allowPublished = false) => (req, _res, next) => {
  const errors = [];
  const values = readListQuery(req.query, errors, { allowPublished, allowSearch: true });
  const category = typeof req.query.category === "string" ? req.query.category.trim() : req.query.category;
  addError(errors, "category", category !== undefined && typeof category !== "string", "Must be a string");
  addError(errors, "category", typeof category === "string" && category.length > 100, "Must not exceed 100 characters");

  if (errors.length) return next(validationError(errors));
  req.validated = { ...values, category };
  return next();
};

const validateNewsBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];
  if (!validateBodyShape(body, ALLOWED_FIELDS, ["title", "slug"], partial, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "title", 200, { nonEmpty: true });
  validateSlugField(errors, body);
  validateString(errors, body, "excerpt", 1000);
  validateString(errors, body, "content", 100000);
  validateString(errors, body, "category", 100);
  validateBooleanFields(errors, body, ["featured", "published"]);
  validateDateField(errors, body, "publishedAt");
  if (body.thumbnail !== undefined && body.thumbnail !== null) {
    validateImage(body.thumbnail, "thumbnail", errors);
  }
  if (body.tags !== undefined) {
    addError(errors, "tags", !Array.isArray(body.tags), "Must be an array");
    if (Array.isArray(body.tags)) {
      addError(errors, "tags", body.tags.length > 30, "Must contain at most 30 tags");
      body.tags.forEach((tag, index) =>
        addError(errors, `tags.${index}`, typeof tag !== "string" || !tag.trim() || tag.length > 50, "Must be a non-empty string up to 50 characters"));
    }
  }

  if (errors.length) return next(validationError(errors));
  req.validated = {
    body: {
      ...body,
      ...(body.content === undefined ? {} : { content: sanitizeRichText(body.content) }),
    },
  };
  return next();
};

export const validateNewsSlug = validateSlugParam;
export const validateNewsId = validateObjectId;
export const validateCreateNews = validateNewsBody(false);
export const validateUpdateNews = validateNewsBody(true);
