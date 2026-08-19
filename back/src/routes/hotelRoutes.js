import { Router } from "express";
import { getAllHotelsController, getHotelByIdController } from "../controllers/hotelController.js";

const router = Router();
router.get("/", getAllHotelsController);
router.get("/:id", getHotelByIdController);

export default router;
