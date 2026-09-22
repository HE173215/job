import { Router } from "express";
import {
  getPublishedEra,
  listPublishedEras,
} from "../controllers/eraController.js";
import { validateEraId } from "../validators/eraValidator.js";

const router = Router();

router.get("/", listPublishedEras);
router.get("/:id", validateEraId, getPublishedEra);

export default router;
