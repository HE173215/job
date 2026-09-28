import {
  addError,
  SLUG_PATTERN,
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
const ALLOWED_POST_FIELDS = new Set([
  "_id", "id", "title", "date", "category", "excerpt", "imageUrl", "author",
  "createdAt", "updatedAt",
]);

const validatePost = (post, field, errors) => {
  if (!post || typeof post !== "object" || Array.isArray(post)) {
    errors.push({ field, message: "Must be an object" });
    return;
  }
  for (const key of Object.keys(post)) {
    addError(errors, `${field}.${key}`, !ALLOWED_POST_FIELDS.has(key), "Unknown field");
  }
  const fieldErrors = [];
  validateString(fieldErrors, post, "id", 100);
  validateString(fieldErrors, post, "_id", 24);
  validateString(fieldErrors, post, "title", 300, { nonEmpty: true });
  validateString(fieldErrors, post, "date", 50);
  validateString(fieldErrors, post, "category", 100);
  validateString(fieldErrors, post, "excerpt", 1000);
  validateString(fieldErrors, post, "imageUrl", 2048);
  validateString(fieldErrors, post, "author", 100);
  errors.push(...fieldErrors.map((error) => ({ ...error, field: `${field}.${error.field}` })));
  addError(errors, `${field}.title`, post.title === undefined, "Required field");
  if (typeof post.imageUrl === "string" && post.imageUrl) {
    try {
      addError(errors, `${field}.imageUrl`, new URL(post.imageUrl).protocol !== "https:", "Must be an HTTPS URL");
    } catch {
      addError(errors, `${field}.imageUrl`, true, "Must be a valid HTTPS URL");
    }
  }
};

const validateBattalionBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];

  if (!validateBodyShape(body, ALLOWED_BATTALION_FIELDS, REQUIRED_CREATE_FIELDS, partial, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "code", 50);
  addError(errors, "code", body.code !== undefined && !SLUG_PATTERN.test(body.code), "Must contain lowercase letters, numbers and single hyphens only");
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
      for (const key of Object.keys(body.stats)) {
        addError(errors, `stats.${key}`, !["established", "highlight"].includes(key), "Unknown field");
      }
      validateString(errors, body.stats, "established", 200);
      validateString(errors, body.stats, "highlight", 200);
    }
  }

  if (body.posts !== undefined) {
    addError(errors, "posts", !Array.isArray(body.posts), "Must be an array of posts");
    if (Array.isArray(body.posts)) {
      addError(errors, "posts", body.posts.length > 200, "Must contain at most 200 posts");
      body.posts.forEach((post, index) => validatePost(post, `posts.${index}`, errors));
    }
  }

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};

export const validateCreateBattalion = validateBattalionBody(false);
export const validateUpdateBattalion = validateBattalionBody(true);

export const validateBattalionId = (req, _res, next) => {
  const id = req.params.id;
  if (!id || typeof id !== "string" || (!/^[0-9a-fA-F]{24}$/.test(id) && !SLUG_PATTERN.test(id)) || id.length > 100) {
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

  validatePost(body, "body", errors);

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};

export const validateBattalionPostId = (req, _res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.postId)) {
    return next(validationError([{ field: "postId", message: "Invalid post id" }]));
  }
  return next();
};
