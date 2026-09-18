import {
  readListQuery,
  sanitizeRichText,
  validateBodyShape,
  validateBooleanFields,
  validateDateField,
  validateImage,
  validateImageArray,
  validateNumberField,
  validateObjectId,
  validateSlugField,
  validateSlugParam,
  validateString,
  validationError,
} from "./commonValidator.js";

const ALLOWED_FIELDS = new Set([
  "title", "slug", "excerpt", "content", "coverImage", "gallery",
  "startDate", "endDate", "location", "featured", "published", "order",
]);

export const validateActivityList = (allowPublished = false) => (req, _res, next) => {
  const errors = [];
  const values = readListQuery(req.query, errors, { allowPublished });
  if (errors.length) return next(validationError(errors));
  req.validated = values;
  return next();
};

const validateActivityBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];
  if (!validateBodyShape(body, ALLOWED_FIELDS, ["title", "slug"], partial, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "title", 200, { nonEmpty: true });
  validateSlugField(errors, body);
  validateString(errors, body, "excerpt", 1000);
  validateString(errors, body, "content", 100000);
  validateString(errors, body, "location", 300);
  validateDateField(errors, body, "startDate");
  validateDateField(errors, body, "endDate");
  validateNumberField(errors, body, "order");
  validateBooleanFields(errors, body, ["featured", "published"]);
  if (body.coverImage !== undefined && body.coverImage !== null) {
    validateImage(body.coverImage, "coverImage", errors);
  }
  if (body.gallery !== undefined) validateImageArray(body.gallery, "gallery", errors);
  if (body.startDate && body.endDate && new Date(body.endDate) < new Date(body.startDate)) {
    errors.push({ field: "endDate", message: "Must not be before startDate" });
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

export const validateActivitySlug = validateSlugParam;
export const validateActivityId = validateObjectId;
export const validateCreateActivity = validateActivityBody(false);
export const validateUpdateActivity = validateActivityBody(true);
