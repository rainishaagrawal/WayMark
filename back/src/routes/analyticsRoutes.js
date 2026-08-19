import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getUserAnalyticsController } from "../controllers/analyticsController.js";

const router = Router();
router.use(verifyJWT);
router.get("/user", getUserAnalyticsController);

export default router;
