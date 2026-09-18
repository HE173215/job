import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getAdminActivity,
  listAdminActivities,
  updateActivity,
} from "../controllers/activityController.js";
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

const router = Router();

router.use(authenticate, authorize("admin", "editor"));
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

export default router;
