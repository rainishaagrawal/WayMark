import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  getPersonalizedRecommendationsController,
  getDestinationRecommendationsController,
} from "../controllers/recommendationController.js";

const router = Router();
router.use(verifyJWT);
router.get("/personalized", getPersonalizedRecommendationsController);
router.get("/destinations", getDestinationRecommendationsController);

export default router;
