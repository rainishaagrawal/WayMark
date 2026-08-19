import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  getUserNotificationsController,
  getUnreadCountController,
  markNotificationReadController,
  markAllReadController,
} from "../controllers/notificationController.js";

const router = Router();
router.use(verifyJWT);

router.get("/", getUserNotificationsController);
router.get("/unread-count", getUnreadCountController);
router.patch("/:id/read", markNotificationReadController);
router.patch("/read-all", markAllReadController);

export default router;
