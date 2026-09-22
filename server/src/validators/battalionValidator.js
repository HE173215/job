import {
  addError,
  validateBodyShape,
  validateNumberField,
  validateObjectId,
  validateString,
  validationError,
} from "./commonValidator.js";

const ALLOWED_BATTALION_FIELDS = new Set([
  "code",
  "name",
  "fullName",
  "emblemTitle",
  "slogan",
  "tradition",
  "mission",
  "stats",
  "posts",
  "order",
]);

const REQUIRED_CREATE_FIELDS = ["name", "fullName"];

const validateBattalionBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];

  if (!validateBodyShape(body, ALLOWED_BATTALION_FIELDS, REQUIRED_CREATE_FIELDS, partial, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "code", 50);
  validateString(errors, body, "name", 150, { nonEmpty: !partial });
  validateString(errors, body, "fullName", 250, { nonEmpty: !partial });
  validateString(errors, body, "emblemTitle", 200);
  validateString(errors, body, "slogan", 300);
  validateString(errors, body, "tradition", 3000);
  validateString(errors, body, "mission", 3000);

  if (body.order !== undefined) {
    body.order = Number(body.order);
    validateNumberField(errors, body, "order", { min: 0 });
  }

  if (body.stats !== undefined) {
    if (typeof body.stats !== "object" || body.stats === null) {
      addError(errors, "stats", true, "Must be an object");
    } else {
      validateString(errors, body.stats, "established", 200);
      validateString(errors, body.stats, "highlight", 200);
    }
  }

  if (body.posts !== undefined && !Array.isArray(body.posts)) {
    addError(errors, "posts", true, "Must be an array of posts");
  }

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};

export const validateCreateBattalion = validateBattalionBody(false);
export const validateUpdateBattalion = validateBattalionBody(true);

export const validateBattalionId = (req, _res, next) => {
  const id = req.params.id;
  if (!id || typeof id !== "string") {
    return next(validationError([{ field: "id", message: "Id or code is required" }]));
  }
  return next();
};

export const validateBattalionPost = (req, _res, next) => {
  const body = req.body;
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return next(validationError([{ field: "body", message: "Must be an object" }]));
  }

  validateString(errors, body, "title", 300, { nonEmpty: true });
  validateString(errors, body, "date", 50);
  validateString(errors, body, "category", 100);
  validateString(errors, body, "excerpt", 1000);
  validateString(errors, body, "imageUrl", 500);
  validateString(errors, body, "author", 100);

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};
