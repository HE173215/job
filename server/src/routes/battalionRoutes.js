import { Router } from "express";
import {
  getPublishedBattalion,
  listPublishedBattalions,
} from "../controllers/battalionController.js";
import { validateBattalionId } from "../validators/battalionValidator.js";

const router = Router();

router.get("/", listPublishedBattalions);
router.get("/:id", validateBattalionId, getPublishedBattalion);

export default router;
