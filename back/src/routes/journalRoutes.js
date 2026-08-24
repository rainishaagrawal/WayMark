import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  listJournalsController,
  getJournalController,
  createManualJournalController,
  updateJournalController,
  deleteJournalController,
} from "../controllers/journalController.js";

const router = Router();
router.use(verifyJWT);

router.get("/", listJournalsController);
router.get("/:id", getJournalController);
router.post("/", createManualJournalController);
router.patch("/:id", updateJournalController);
router.delete("/:id", deleteJournalController);

export default router;
