import { Router } from "express";
import {
  getPublishedActivity,
  listPublishedActivities,
} from "../controllers/activityController.js";
import {
  validateActivityList,
  validateActivitySlug,
} from "../validators/activityValidator.js";

const router = Router();

router.get("/", validateActivityList(), listPublishedActivities);
router.get("/:slug", validateActivitySlug, getPublishedActivity);

export default router;
