import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  createMemoryController,
  uploadMemoryController,
  getMemoriesController,
  deleteMemoryController,
  updateMemoryController,
  createCollectionController,
  getTravelDnaController,
} from "../controllers/memoryController.js";

const router = Router();
router.use(verifyJWT);

router.post("/", createMemoryController);
router.post("/upload", upload.single("image"), uploadMemoryController);
router.get("/", getMemoriesController);
router.delete("/:id", deleteMemoryController);
router.patch("/:id", updateMemoryController);
router.post("/collections", createCollectionController);
router.get("/travel-dna", getTravelDnaController);

export default router;
