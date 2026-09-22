import { Router } from "express";
import { getIntroduction } from "../controllers/introductionController.js";

const router = Router();

router.get("/", getIntroduction);

export default router;
