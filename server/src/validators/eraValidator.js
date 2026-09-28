import {
  addError,
  SLUG_PATTERN,
  validateBodyShape,
  validateNumberField,
  validateSlugField,
  validateString,
  validationError,
} from "./commonValidator.js";

const ALLOWED_FIELDS = new Set([
  "slug",
  "name",
  "timeframe",
  "title",
  "description",
  "quote",
  "startYear",
  "endYear",
  "order",
]);

const REQUIRED_CREATE_FIELDS = ["name", "timeframe", "title", "startYear", "endYear"];

const validateEraBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];

  if (!validateBodyShape(body, ALLOWED_FIELDS, REQUIRED_CREATE_FIELDS, partial, errors)) {
    return next(validationError(errors));
  }

  validateSlugField(errors, body);
  validateString(errors, body, "name", 150, { nonEmpty: !partial });
  validateString(errors, body, "timeframe", 100, { nonEmpty: !partial });
  validateString(errors, body, "title", 300, { nonEmpty: !partial });
  validateString(errors, body, "description", 2000);
  validateString(errors, body, "quote", 500);

  if (body.startYear !== undefined) {
    body.startYear = Number(body.startYear);
    validateNumberField(errors, body, "startYear", { min: 1900 });
  }

  if (body.endYear !== undefined) {
    body.endYear = Number(body.endYear);
    validateNumberField(errors, body, "endYear", { min: 1900 });
  }

  const startYear = body.startYear;
  const endYear = body.endYear;
  if (Number.isFinite(startYear) && Number.isFinite(endYear)) {
    addError(errors, "endYear", endYear < startYear, "Must not be before startYear");
  }

  if (body.order !== undefined) {
    body.order = Number(body.order);
    validateNumberField(errors, body, "order", { min: 0 });
  }

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};

export const validateCreateEra = validateEraBody(false);
export const validateUpdateEra = validateEraBody(true);

export const validateEraId = (req, _res, next) => {
  const id = req.params.id;
  if (!id || typeof id !== "string" || (!/^[0-9a-fA-F]{24}$/.test(id) && !SLUG_PATTERN.test(id)) || id.length > 100) {
    return next(validationError([{ field: "id", message: "Id or slug is required" }]));
  }
  return next();
};
