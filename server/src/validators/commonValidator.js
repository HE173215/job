import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import { AppError } from "../utils/AppError.js";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const addError = (errors, field, condition, message) => {
  if (condition) errors.push({ field, message });
};

const parsePositiveInteger = (value, fallback, max) => {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value))) return null;
  const parsed = Number(value);
  return parsed >= 1 && parsed <= max ? parsed : null;
};

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return null;
};

export const readListQuery = (
  query,
  errors,
  { allowPublished = false, allowSearch = false } = {},
) => {
  const page = parsePositiveInteger(query.page, 1, 1_000_000);
  const limit = parsePositiveInteger(query.limit, 12, 100);
  const featured = parseBoolean(query.featured);
  const published = allowPublished ? parseBoolean(query.published) : undefined;
  const search =
    allowSearch && typeof query.search === "string"
      ? query.search.trim()
      : query.search;

  addError(errors, "page", page === null, "Must be an integer from 1 to 1000000");
  addError(errors, "limit", limit === null, "Must be an integer from 1 to 100");
  addError(errors, "featured", featured === null, "Must be true or false");
  addError(errors, "published", allowPublished && published === null, "Must be true or false");
  addError(errors, "search", allowSearch && search !== undefined && typeof search !== "string", "Must be a string");
  addError(errors, "search", typeof search === "string" && search.length > 100, "Must not exceed 100 characters");

  return { page, limit, featured, published, search };
};

export const validateBodyShape = (body, allowed, required, partial, errors) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    errors.push({ field: "body", message: "Must be an object" });
    return false;
  }

  for (const field of Object.keys(body)) {
    addError(errors, field, !allowed.has(field), "Unknown field");
  }

  if (partial) {
    addError(errors, "body", Object.keys(body).length === 0, "At least one field is required");
  } else {
    for (const field of required) {
      addError(errors, field, body[field] === undefined, "Required field");
    }
  }

  return true;
};

export const validateString = (errors, body, field, max, { nonEmpty = false } = {}) => {
  if (body[field] === undefined || body[field] === null) return;
  addError(
    errors,
    field,
    typeof body[field] !== "string"
      || body[field].length > max
      || (nonEmpty && !body[field].trim()),
    `Must be ${nonEmpty ? "a non-empty " : "a "}string up to ${max} characters`,
  );
};

export const validateSlugField = (errors, body) => {
  addError(
    errors,
    "slug",
    body.slug !== undefined
      && (typeof body.slug !== "string"
        || !SLUG_PATTERN.test(body.slug)
        || body.slug.length > 200),
    "Must contain lowercase letters, numbers and single hyphens only",
  );
};

export const validateBooleanFields = (errors, body, fields) => {
  for (const field of fields) {
    addError(errors, field, body[field] !== undefined && typeof body[field] !== "boolean", "Must be a boolean");
  }
};

export const validateNumberField = (errors, body, field, { min } = {}) => {
  addError(
    errors,
    field,
    body[field] !== undefined
      && (!Number.isFinite(body[field]) || (min !== undefined && body[field] < min)),
    min === undefined ? "Must be a number" : `Must be a number greater than or equal to ${min}`,
  );
};

export const validateDateField = (errors, body, field) => {
  addError(
    errors,
    field,
    body[field] !== undefined
      && body[field] !== null
      && (typeof body[field] !== "string" || Number.isNaN(Date.parse(body[field]))),
    "Must be a valid date string or null",
  );
};

export const validateImage = (value, field, errors, { ordered = false } = {}) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    errors.push({ field, message: "Must be an object or null" });
    return;
  }

  const allowed = new Set([
    "publicId", "url", "alt", "caption", "width", "height", "format", "bytes",
    ...(ordered ? ["order"] : []),
  ]);
  for (const key of Object.keys(value)) {
    addError(errors, `${field}.${key}`, !allowed.has(key), "Unknown field");
  }

  for (const required of ["publicId", "url"]) {
    addError(errors, `${field}.${required}`, typeof value[required] !== "string" || !value[required].trim(), "Required string");
  }
  validateString(errors, value, "publicId", 500, { nonEmpty: true });
  validateString(errors, value, "url", 2048, { nonEmpty: true });
  validateString(errors, value, "alt", 300);
  validateString(errors, value, "caption", 1000);
  validateString(errors, value, "format", 30);

  if (typeof value.url === "string") {
    try {
      addError(errors, `${field}.url`, new URL(value.url).protocol !== "https:", "Must be an HTTPS URL");
    } catch {
      errors.push({ field: `${field}.url`, message: "Must be a valid HTTPS URL" });
    }
  }

  for (const numberField of ["width", "height", "bytes", ...(ordered ? ["order"] : [])]) {
    validateNumberField(errors, value, numberField, { min: 0 });
  }
};

export const validateImageArray = (value, field, errors, options = {}) => {
  if (!Array.isArray(value)) {
    errors.push({ field, message: "Must be an array" });
    return;
  }
  addError(errors, field, value.length > (options.max ?? 100), `Must contain at most ${options.max ?? 100} images`);
  value.forEach((image, index) => validateImage(image, `${field}.${index}`, errors, options));
};

export const sanitizeRichText = (value) =>
  sanitizeHtml(value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https"],
  });

export const validationError = (errors) =>
  new AppError(422, "Validation failed", errors);

export const validateSlugParam = (req, _res, next) => {
  if (!SLUG_PATTERN.test(req.params.slug) || req.params.slug.length > 200) {
    return next(validationError([{ field: "slug", message: "Invalid slug" }]));
  }
  return next();
};

export const validateObjectId = (req, _res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(validationError([{ field: "id", message: "Invalid resource id" }]));
  }
  return next();
};
