import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  addExpenseController,
  deleteExpenseController,
  splitExpenseController,
  settleExpenseController,
  getTripExpensesController,
  getMyTripExpensesController,
} from "../controllers/expenseController.js";

const router = Router();
router.use(verifyJWT);

router.post("/", addExpenseController);
router.delete("/:id", deleteExpenseController);
router.post("/split", splitExpenseController);
router.post("/settle", settleExpenseController);
router.get("/trip/:tripId", getTripExpensesController);
router.get("/trip/:tripId/mine", getMyTripExpensesController);

export default router;
