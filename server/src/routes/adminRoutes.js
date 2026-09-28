import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createActivity,
  deleteActivity,
  getAdminActivity,
  listAdminActivities,
  updateActivity,
} from "../controllers/activityController.js";
import {
  createEra,
  deleteEra,
  getAdminEra,
  listAdminEras,
  updateEra,
} from "../controllers/eraController.js";
import {
  addBattalionPost,
  createBattalion,
  deleteBattalion,
  deleteBattalionPost,
  getAdminBattalion,
  listAdminBattalions,
  updateBattalion,
} from "../controllers/battalionController.js";
import {
  createGallery,
  deleteGallery,
  getAdminGallery,
  listAdminGallery,
  updateGallery,
} from "../controllers/galleryController.js";
import {
  createMilestone,
  deleteMilestone,
  getAdminMilestone,
  listAdminMilestones,
  updateMilestone,
} from "../controllers/milestoneController.js";
import { createUploadSignature } from "../controllers/mediaController.js";
import {
  getIntroduction,
  updateIntroduction,
} from "../controllers/introductionController.js";
import {
  createNews,
  deleteNews,
  getAdminNews,
  listAdminNews,
  updateNews,
} from "../controllers/newsController.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { auditAdminMutation } from "../middlewares/auditAdminMutation.js";
import {
  validateCreateMilestone,
  validateMilestoneId,
  validateMilestoneList,
  validateUpdateMilestone,
} from "../validators/milestoneValidator.js";
import { validateMediaSignature } from "../validators/mediaValidator.js";
import {
  validateActivityId,
  validateActivityList,
  validateCreateActivity,
  validateUpdateActivity,
} from "../validators/activityValidator.js";
import {
  validateCreateGallery,
  validateGalleryId,
  validateGalleryList,
  validateUpdateGallery,
} from "../validators/galleryValidator.js";
import {
  validateCreateNews,
  validateNewsId,
  validateNewsList,
  validateUpdateNews,
} from "../validators/newsValidator.js";
import {
  validateCreateEra,
  validateEraId,
  validateUpdateEra,
} from "../validators/eraValidator.js";
import { validateIntroduction } from "../validators/introductionValidator.js";
import {
  validateBattalionId,
  validateBattalionPost,
  validateBattalionPostId,
  validateCreateBattalion,
  validateUpdateBattalion,
} from "../validators/battalionValidator.js";
import { validateSearchQuery } from "../validators/commonValidator.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const router = Router();
const mediaSignatureLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.nodeEnv === "production" ? 100 : 10_000,
  skip: () => env.nodeEnv !== "production",
  keyGenerator: (req) => String(req.user._id),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new AppError(429, "Too many upload requests, please try again later")),
});

router.use(authenticate, authorize("admin", "editor"));
router.use(auditAdminMutation);
router
  .route("/introduction")
  .get(getIntroduction)
  .put(validateIntroduction, updateIntroduction);
router.post("/media/signature", mediaSignatureLimiter, validateMediaSignature, createUploadSignature);
router
  .route("/milestones")
  .get(validateMilestoneList(true), listAdminMilestones)
  .post(validateCreateMilestone, createMilestone);
router
  .route("/milestones/:id")
  .get(validateMilestoneId, getAdminMilestone)
  .patch(validateMilestoneId, validateUpdateMilestone, updateMilestone)
  .delete(authorize("admin"), validateMilestoneId, deleteMilestone);
router
  .route("/news")
  .get(validateNewsList(true), listAdminNews)
  .post(validateCreateNews, createNews);
router
  .route("/news/:id")
  .get(validateNewsId, getAdminNews)
  .patch(validateNewsId, validateUpdateNews, updateNews)
  .delete(authorize("admin"), validateNewsId, deleteNews);
router
  .route("/activities")
  .get(validateActivityList(true), listAdminActivities)
  .post(validateCreateActivity, createActivity);
router
  .route("/activities/:id")
  .get(validateActivityId, getAdminActivity)
  .patch(validateActivityId, validateUpdateActivity, updateActivity)
  .delete(authorize("admin"), validateActivityId, deleteActivity);
router
  .route("/gallery")
  .get(validateGalleryList(true), listAdminGallery)
  .post(validateCreateGallery, createGallery);
router
  .route("/gallery/:id")
  .get(validateGalleryId, getAdminGallery)
  .patch(validateGalleryId, validateUpdateGallery, updateGallery)
  .delete(authorize("admin"), validateGalleryId, deleteGallery);

// Eras Management
router
  .route("/eras")
  .get(validateSearchQuery, listAdminEras)
  .post(validateCreateEra, createEra);
router
  .route("/eras/:id")
  .get(validateEraId, getAdminEra)
  .patch(validateEraId, validateUpdateEra, updateEra)
  .delete(authorize("admin"), validateEraId, deleteEra);

// Battalions Management
router
  .route("/battalions")
  .get(validateSearchQuery, listAdminBattalions)
  .post(validateCreateBattalion, createBattalion);
router
  .route("/battalions/:id")
  .get(validateBattalionId, getAdminBattalion)
  .patch(validateBattalionId, validateUpdateBattalion, updateBattalion)
  .delete(authorize("admin"), validateBattalionId, deleteBattalion);
router.post("/battalions/:id/posts", validateBattalionId, validateBattalionPost, addBattalionPost);
router.delete("/battalions/:id/posts/:postId", authorize("admin"), validateBattalionId, validateBattalionPostId, deleteBattalionPost);

export default router;
