import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getMyBadgesController } from "../controllers/badgeController.js";

const router = Router();
router.use(verifyJWT);
router.get("/mine", getMyBadgesController);

export default router;
