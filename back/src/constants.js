/**
 * Centralized Application Constants for WayMark Service
 */

export const DB_NAME = "WayMark";

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
});

export const RESPONSE_MESSAGES = Object.freeze({
  SUCCESS: "Operation completed successfully.",
  CREATED: "Resource created successfully.",
  BAD_REQUEST: "Invalid input or missing required parameters.",
  UNAUTHORIZED: "Authentication failed or token missing.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Requested resource could not be found.",
  CONFLICT: "Resource conflict or duplicate entry detected.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  INTERNAL_SERVER_ERROR: "An internal server error occurred. Please try again later.",
  VALIDATION_ERROR: "Validation error occurred.",
});

export const USER_ROLES = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
  VENDOR: "VENDOR",
  GUEST: "GUEST",
});

export const USER_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
});

export const BADGE_CODES = Object.freeze({
  FIRST_TRIP: "FIRST_TRIP",
  EXPLORER_3: "EXPLORER_3",
  GLOBETROTTER_5: "GLOBETROTTER_5",
  LEGEND_10: "LEGEND_10",
  MEMORY_KEEPER: "MEMORY_KEEPER",
  GROUP_LEADER: "GROUP_LEADER",
});
