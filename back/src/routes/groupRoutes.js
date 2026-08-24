import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  createGroupTripController,
  joinGroupTripController,
  getGroupTripByIdController,
  listMyGroupTripsController,
  deleteGroupTripController,
} from "../controllers/groupTripController.js";

const router = Router();
router.use(verifyJWT);

router.get("/mine", listMyGroupTripsController);
router.post("/", createGroupTripController);
router.post("/invite", joinGroupTripController);
router.get("/:id", getGroupTripByIdController);
router.delete("/:id", deleteGroupTripController);

export default router;
