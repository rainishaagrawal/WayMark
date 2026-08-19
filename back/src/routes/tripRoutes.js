import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  listTripsController,
  getTripController,
  deleteTripController,
  updateTripBannerController,
  updateTripNotesController,
  updateTripDaysController,
  completeTripController,
} from "../controllers/tripController.js";

const router = Router();
router.use(verifyJWT);

router.get("/", listTripsController);
router.get("/:id", getTripController);
router.delete("/:id", deleteTripController);
router.patch("/:id/banner", updateTripBannerController);
router.patch("/:id/notes", updateTripNotesController);
router.patch("/:id/days", updateTripDaysController);
router.patch("/:id/complete", completeTripController);

export default router;
