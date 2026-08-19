import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as expenseService from "../services/expenseService.js";

export const addExpenseController = asyncHandler(async (req, res) => {
  const expense = await expenseService.addExpense(req.user._id, req.body);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, expense, "Expense added successfully"));
});

export const deleteExpenseController = asyncHandler(async (req, res) => {
  const result = await expenseService.deleteExpense(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const splitExpenseController = asyncHandler(async (req, res) => {
  const { expenseId, splits } = req.body;
  const splitRecords = await expenseService.splitExpense(expenseId, splits);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, splitRecords, "Expense split records updated"));
});

export const settleExpenseController = asyncHandler(async (req, res) => {
  const { splitId } = req.body;
  const settled = await expenseService.settleExpenseSplit(splitId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, settled, "Expense settled successfully"));
});

export const getTripExpensesController = asyncHandler(async (req, res) => {
  const summary = await expenseService.getTripExpenses(req.params.tripId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, summary, "Trip expenses retrieved successfully"));
});

export const getMyTripExpensesController = asyncHandler(async (req, res) => {
  const summary = await expenseService.getMyTripExpenses(req.params.tripId, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, summary, "Your trip expenses retrieved successfully"));
});
