import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as journalService from "../services/journalService.js";

export const listJournalsController = asyncHandler(async (req, res) => {
  const journals = await journalService.listUserJournals(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, journals, "Journal entries retrieved successfully"));
});

export const getJournalController = asyncHandler(async (req, res) => {
  const journal = await journalService.getJournalById(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, journal, "Journal entry retrieved successfully"));
});

export const createManualJournalController = asyncHandler(async (req, res) => {
  const journal = await journalService.createManualJournal(req.user._id, req.body);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, journal, "Journal entry created successfully"));
});

export const updateJournalController = asyncHandler(async (req, res) => {
  const journal = await journalService.updateJournal(req.params.id, req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, journal, "Journal entry updated successfully"));
});

export const deleteJournalController = asyncHandler(async (req, res) => {
  const result = await journalService.deleteJournal(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});
