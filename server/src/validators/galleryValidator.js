import {
  readListQuery,
  validateBodyShape,
  validateBooleanFields,
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
  "title", "slug", "description", "coverImage", "images",
  "featured", "published", "order",
]);

export const validateGalleryList = (allowPublished = false) => (req, _res, next) => {
  const errors = [];
  const values = readListQuery(req.query, errors, { allowPublished });
  if (errors.length) return next(validationError(errors));
  req.validated = values;
  return next();
};

const validateGalleryBody = (partial) => (req, _res, next) => {
  const body = req.body;
  const errors = [];
  if (!validateBodyShape(body, ALLOWED_FIELDS, ["title", "slug"], partial, errors)) {
    return next(validationError(errors));
  }

  validateString(errors, body, "title", 200, { nonEmpty: true });
  validateSlugField(errors, body);
  validateString(errors, body, "description", 5000);
  validateNumberField(errors, body, "order");
  validateBooleanFields(errors, body, ["featured", "published"]);
  if (body.coverImage !== undefined && body.coverImage !== null) {
    validateImage(body.coverImage, "coverImage", errors);
  }
  if (body.images !== undefined) {
    validateImageArray(body.images, "images", errors, { ordered: true, max: 500 });
  }

  if (errors.length) return next(validationError(errors));
  req.validated = { body };
  return next();
};

export const validateGallerySlug = validateSlugParam;
export const validateGalleryId = validateObjectId;
export const validateCreateGallery = validateGalleryBody(false);
export const validateUpdateGallery = validateGalleryBody(true);
