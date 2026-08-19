import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  planTripController,
  generateJournalController,
  aiChatController,
  createManualTripController,
} from "../controllers/aiController.js";

const router = Router();
router.use(verifyJWT);

router.post("/plan-trip", planTripController);
router.post("/manual-trip", createManualTripController);
router.post("/generate-journal", generateJournalController);
router.post("/chat", aiChatController);

export default router;
