import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddleware.js";
import { USER_ROLES } from "../constants.js";
import {
  getDashboardStatsController,
  getAllUsersAdminController,
  getAllTripsAdminController,
  getAiLogsAdminController,
} from "../controllers/adminController.js";

const router = Router();
router.use(verifyJWT, authorizeRoles(USER_ROLES.ADMIN));

router.get("/dashboard", getDashboardStatsController);
router.get("/users", getAllUsersAdminController);
router.get("/trips", getAllTripsAdminController);
router.get("/ai-logs", getAiLogsAdminController);

export default router;
