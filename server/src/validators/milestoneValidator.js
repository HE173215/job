import {
  addError,
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

const SORTS = {
  order: { order: 1, date: 1, year: 1 },
  "-order": { order: -1, date: -1, year: -1 },
  year: { year: 1, order: 1 },
  "-year": { year: -1, order: -1 },
  createdAt: { createdAt: 1 },
  "-createdAt": { createdAt: -1 },
};
const ALLOWED_FIELDS = new Set([
  "year", "date", "title", "slug", "summary", "content", "era",
  "coverImage", "gallery", "source", "order", "featured", "published",
]);

export const validateMilestoneList = (allowPublished = false) => (req, _res, next) => {
  const errors = [];
  const values = readListQuery(req.query, errors, { allowPublished, allowSearch: true });
  const era = typeof req.query.era === "string" ? req.query.era.trim() : req.query.era;
  const sort = req.query.sort ?? "order";

  addError(errors, "era", era !== undefined && typeof era !== "string", "Must be a string");
  addError(errors, "era", typeof era === "string" && era.length > 200, "Must not exceed 200 characters");
  addError(errors, "sort", !SORTS[sort], "Unsupported sort value");

  if (errors.length) return next(validationError(errors));
  req.validated = { ...values, era, sort: SORTS[sort] };
  return next();
};

const validateMilestoneBody = (partial) => (req, _res, next) => {
  const body = req.body;
  if (body && typeof body === "object" && !Array.isArray(body)) {
    if (typeof body.year === "string" && /^\d+$/.test(body.year.trim())) {
      body.year = parseInt(body.year.trim(), 10);
    }
    if (body.date === "") {
      body.date = null;
    }
    if (body.coverImage && typeof body.coverImage === "object" && !body.coverImage.url) {
      body.coverImage = null;
    }
  }

  const errors = [];
  if (!validateBodyShape(body, ALLOWED_FIELDS, ["year", "title", "slug"], partial, errors)) {
    return next(validationError(errors));
  }

  addError(errors, "year", body.year !== undefined && (!Number.isInteger(body.year) || body.year < 0 || body.year > 9999), "Must be an integer from 0 to 9999");
  validateString(errors, body, "title", 200, { nonEmpty: true });
  validateSlugField(errors, body);
  validateDateField(errors, body, "date");
  validateString(errors, body, "summary", 1000);
  validateString(errors, body, "content", 100000);
  validateString(errors, body, "era", 200);
  validateString(errors, body, "source", 2000);
  validateNumberField(errors, body, "order");
  validateBooleanFields(errors, body, ["featured", "published"]);

  if (body.coverImage !== undefined && body.coverImage !== null) {
    validateImage(body.coverImage, "coverImage", errors);
  }
  if (body.gallery !== undefined) validateImageArray(body.gallery, "gallery", errors);

  if (errors.length) return next(validationError(errors));
  req.validated = {
    body: {
      ...body,
      ...(body.content === undefined ? {} : { content: sanitizeRichText(body.content) }),
    },
  };
  return next();
};

export const validateSlug = validateSlugParam;
export const validateMilestoneId = validateObjectId;
export const validateCreateMilestone = validateMilestoneBody(false);
export const validateUpdateMilestone = validateMilestoneBody(true);
