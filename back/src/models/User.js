import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../constants.js";

/**
 * User Schema representing application users, preferences, and authentication methods.
 * Extended with: travelBio, onboardingCompleted, tripsCompletedCount, hasInteracted
 * (drives the new-user vs returning-user dashboard state on the frontend automatically,
 * instead of a manual toggle).
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, index: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER, index: true },
    avatar: { type: String, default: "" },
    preferredLanguage: { type: String, default: "en" },
    preferredCurrency: { type: String, default: "USD" },
    budgetPreference: { type: String, enum: ["BUDGET", "MODERATE", "LUXURY", "ULTRA_LUXURY"], default: "MODERATE" },
    travelInterests: { type: [String], default: [] },
    foodPreference: { type: String, enum: ["VEGETARIAN", "VEGAN", "HALAL", "KOSHER", "ANYTHING"], default: "ANYTHING" },
    travelStyle: { type: String, enum: ["SOLO", "COUPLE", "FAMILY", "FRIENDS", "BUSINESS"], default: "SOLO" },
    travelBio: { type: String, default: "", maxlength: 500 },
    travelDNA: { type: mongoose.Schema.Types.ObjectId, ref: "TravelDNA" },

    // Drives automatic new-user vs returning-user experience on the frontend
    hasCreatedFirstTrip: { type: Boolean, default: false },
    tripsCompletedCount: { type: Number, default: 0 },

    refreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || "1d" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
  });
};

export const User = mongoose.model("User", userSchema);
export default User;
