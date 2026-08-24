import { Router } from "express";
import { getAllRestaurantsController, getRestaurantByIdController } from "../controllers/restaurantController.js";

const router = Router();
router.get("/", getAllRestaurantsController);
router.get("/:id", getRestaurantByIdController);

export default router;
