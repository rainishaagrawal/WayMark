import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as packingService from "../services/packingService.js";

export const listUserChecklistsController = asyncHandler(async (req, res) => {
  const checklists = await packingService.listUserChecklists(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, checklists, "Your packing checklists retrieved"));
});

export const getTripChecklistController = asyncHandler(async (req, res) => {
  const checklist = await packingService.getTripChecklist(req.params.tripId, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, checklist, "Packing checklist retrieved successfully"));
});

export const createTripChecklistController = asyncHandler(async (req, res) => {
  const { tripId, items } = req.body;
  const checklist = await packingService.createTripChecklist(tripId, req.user._id, items);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, checklist, "Packing checklist created"));
});

export const addChecklistItemController = asyncHandler(async (req, res) => {
  const { tripId, item, category } = req.body;
  const checklist = await packingService.addChecklistItem(tripId, req.user._id, { item, category });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, checklist, "Item added to packing checklist"));
});

export const toggleChecklistItemController = asyncHandler(async (req, res) => {
  const { checklistId, itemId } = req.body;
  const checklist = await packingService.toggleChecklistItem(checklistId, itemId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, checklist, "Checklist item toggled successfully"));
});

export const removeChecklistItemController = asyncHandler(async (req, res) => {
  const { checklistId, itemId } = req.body;
  const checklist = await packingService.removeChecklistItem(checklistId, itemId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, checklist, "Checklist item removed"));
});

export const deleteChecklistController = asyncHandler(async (req, res) => {
  const result = await packingService.deleteChecklist(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});
