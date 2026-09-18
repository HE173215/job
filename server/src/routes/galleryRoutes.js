import { Router } from "express";
import {
  getPublishedGallery,
  listPublishedGallery,
} from "../controllers/galleryController.js";
import {
  validateGalleryList,
  validateGallerySlug,
} from "../validators/galleryValidator.js";

const router = Router();

router.get("/", validateGalleryList(), listPublishedGallery);
router.get("/:slug", validateGallerySlug, getPublishedGallery);

export default router;
