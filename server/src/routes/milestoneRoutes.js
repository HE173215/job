import { Router } from "express";
import {
  getPublishedMilestone,
  listPublishedMilestones,
} from "../controllers/milestoneController.js";
import {
  validateMilestoneList,
  validateSlug,
} from "../validators/milestoneValidator.js";

const router = Router();

router.get("/", validateMilestoneList(), listPublishedMilestones);
router.get("/:slug", validateSlug, getPublishedMilestone);

export default router;
