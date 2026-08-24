import { Router } from "express";
import { getCoordinatesController, getNearbyPoisController, getRouteController } from "../controllers/mapController.js";

const router = Router();
router.get("/coordinates", getCoordinatesController);
router.get("/nearby", getNearbyPoisController);
router.get("/route", getRouteController);

export default router;
