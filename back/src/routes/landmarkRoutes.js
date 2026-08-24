import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { detectLandmarkController } from "../controllers/landmarkController.js";

const router = Router();
router.use(verifyJWT);
router.post("/detect", upload.single("image"), detectLandmarkController);

export default router;
