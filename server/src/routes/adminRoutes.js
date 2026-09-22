import { Router } from "express";
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
  validateCreateBattalion,
  validateUpdateBattalion,
} from "../validators/battalionValidator.js";

const router = Router();

router.use(authenticate, authorize("admin", "editor"));
router
  .route("/introduction")
  .get(getIntroduction)
  .put(validateIntroduction, updateIntroduction);
router.post("/media/signature", validateMediaSignature, createUploadSignature);
router
  .route("/milestones")
  .get(validateMilestoneList(true), listAdminMilestones)
  .post(validateCreateMilestone, createMilestone);
router
  .route("/milestones/:id")
  .get(validateMilestoneId, getAdminMilestone)
  .patch(validateMilestoneId, validateUpdateMilestone, updateMilestone)
  .delete(validateMilestoneId, deleteMilestone);
router
  .route("/news")
  .get(validateNewsList(true), listAdminNews)
  .post(validateCreateNews, createNews);
router
  .route("/news/:id")
  .get(validateNewsId, getAdminNews)
  .patch(validateNewsId, validateUpdateNews, updateNews)
  .delete(validateNewsId, deleteNews);
router
  .route("/activities")
  .get(validateActivityList(true), listAdminActivities)
  .post(validateCreateActivity, createActivity);
router
  .route("/activities/:id")
  .get(validateActivityId, getAdminActivity)
  .patch(validateActivityId, validateUpdateActivity, updateActivity)
  .delete(validateActivityId, deleteActivity);
router
  .route("/gallery")
  .get(validateGalleryList(true), listAdminGallery)
  .post(validateCreateGallery, createGallery);
router
  .route("/gallery/:id")
  .get(validateGalleryId, getAdminGallery)
  .patch(validateGalleryId, validateUpdateGallery, updateGallery)
  .delete(validateGalleryId, deleteGallery);

// Eras Management
router
  .route("/eras")
  .get(listAdminEras)
  .post(validateCreateEra, createEra);
router
  .route("/eras/:id")
  .get(validateEraId, getAdminEra)
  .patch(validateEraId, validateUpdateEra, updateEra)
  .delete(validateEraId, deleteEra);

// Battalions Management
router
  .route("/battalions")
  .get(listAdminBattalions)
  .post(validateCreateBattalion, createBattalion);
router
  .route("/battalions/:id")
  .get(validateBattalionId, getAdminBattalion)
  .patch(validateBattalionId, validateUpdateBattalion, updateBattalion)
  .delete(validateBattalionId, deleteBattalion);
router.post("/battalions/:id/posts", validateBattalionId, validateBattalionPost, addBattalionPost);
router.delete("/battalions/:id/posts/:postId", validateBattalionId, deleteBattalionPost);

export default router;
