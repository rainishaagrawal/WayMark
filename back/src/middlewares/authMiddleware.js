import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";
import { verifyAccessToken } from "../utils/jwtHelper.js";
import User from "../models/User.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized access: Token missing");
    }

    const decodedToken = verifyAccessToken(token);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token: User no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Account has been deactivated or suspended");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Access Denied: Role '${req.user?.role}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};
