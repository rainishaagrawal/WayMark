import { Router } from "express";
import {
  getAllDestinationsController,
  getDestinationByIdController,
  searchDestinationsController,
} from "../controllers/destinationController.js";

const router = Router();
router.get("/", getAllDestinationsController);
router.get("/search", searchDestinationsController);
router.get("/:id", getDestinationByIdController);

export default router;
