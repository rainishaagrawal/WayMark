import Joi from "joi";
import { USER_ROLES } from "../constants.js";

/**
 * Joi Validation Schemas for Authentication & User Requests.
 */

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  role: Joi.string().valid(...Object.values(USER_ROLES)).optional(),
  preferredLanguage: Joi.string().optional(),
  budgetPreference: Joi.string().valid("BUDGET", "MODERATE", "LUXURY", "ULTRA_LUXURY").optional(),
  travelInterests: Joi.array().items(Joi.string()).optional(),
  foodPreference: Joi.string().valid("VEGETARIAN", "VEGAN", "HALAL", "KOSHER", "ANYTHING").optional(),
  travelStyle: Joi.string().valid("SOLO", "COUPLE", "FAMILY", "FRIENDS", "BUSINESS").optional(),
  travelBio: Joi.string().max(500).allow("").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters long",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters long",
  }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  preferredLanguage: Joi.string().optional(),
  budgetPreference: Joi.string().valid("BUDGET", "MODERATE", "LUXURY", "ULTRA_LUXURY").optional(),
  travelInterests: Joi.array().items(Joi.string()).optional(),
  foodPreference: Joi.string().valid("VEGETARIAN", "VEGAN", "HALAL", "KOSHER", "ANYTHING").optional(),
  travelStyle: Joi.string().valid("SOLO", "COUPLE", "FAMILY", "FRIENDS", "BUSINESS").optional(),
  avatar: Joi.string().uri().optional(),
  travelBio: Joi.string().max(500).allow("").optional(),
});

export const createTripSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).optional(),
  destinationName: Joi.string().trim().min(1).max(150).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  budgetAmount: Joi.number().min(0).optional(),
  notes: Joi.string().allow("").optional(),
  bannerImage: Joi.string().uri().allow("").optional(),
});
