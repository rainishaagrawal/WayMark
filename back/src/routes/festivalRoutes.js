import { Router } from "express";
import { getAllFestivalsController, searchFestivalsController } from "../controllers/festivalController.js";

const router = Router();
router.get("/", getAllFestivalsController);
router.get("/search", searchFestivalsController);

export default router;
