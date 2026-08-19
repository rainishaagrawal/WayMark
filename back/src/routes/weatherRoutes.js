import { Router } from "express";
import { getCurrentWeatherController, getWeatherForecastController } from "../controllers/weatherController.js";

const router = Router();
router.get("/current", getCurrentWeatherController);
router.get("/forecast", getWeatherForecastController);

export default router;
