import { Router } from "express";
import { getPublishedNews, listPublishedNews } from "../controllers/newsController.js";
import { validateNewsList, validateNewsSlug } from "../validators/newsValidator.js";

const router = Router();

router.get("/", validateNewsList(), listPublishedNews);
router.get("/:slug", validateNewsSlug, getPublishedNews);

export default router;
