import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  listUserChecklistsController,
  getTripChecklistController,
  createTripChecklistController,
  addChecklistItemController,
  toggleChecklistItemController,
  removeChecklistItemController,
  deleteChecklistController,
} from "../controllers/packingController.js";

const router = Router();
router.use(verifyJWT);

router.get("/mine", listUserChecklistsController);
router.get("/:tripId", getTripChecklistController);
router.post("/", createTripChecklistController);
router.post("/item", addChecklistItemController);
router.patch("/item", toggleChecklistItemController);
router.delete("/item", removeChecklistItemController);
router.delete("/:id", deleteChecklistController);

export default router;
