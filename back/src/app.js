import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { HTTP_STATUS, RESPONSE_MESSAGES } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes Imports
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import destinationRouter from "./routes/destinationRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import weatherRouter from "./routes/weatherRoutes.js";
import mapRouter from "./routes/mapRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import memoryRouter from "./routes/memoryRoutes.js";
import recommendationRouter from "./routes/recommendationRoutes.js";
import landmarkRouter from "./routes/landmarkRoutes.js";
import groupRouter from "./routes/groupRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import packingRouter from "./routes/packingRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import tripRouter from "./routes/tripRoutes.js";
import journalRouter from "./routes/journalRoutes.js";
import badgeRouter from "./routes/badgeRoutes.js";
import festivalRouter from "./routes/festivalRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS policy violation"));
  },
  credentials: true,
  methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Manually ensure CORS headers on every response (safety net)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: false,
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: RESPONSE_MESSAGES.TOO_MANY_REQUESTS,
    errors: [],
  },
});
app.use("/api", limiter);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      { service: "VoyageAI Backend API", version: "1.1.0", status: "RUNNING", healthCheck: "/health", apiBase: "/api/v1" },
      "Welcome to VoyageAI Backend API Service! Everything is working perfectly."
    )
  );
});

app.get("/health", (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      { uptime: process.uptime(), timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" },
      "VoyageAI API Service is healthy and operational."
    )
  );
});

// API Routes Declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/destinations", destinationRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/weather", weatherRouter);
app.use("/api/v1/maps", mapRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/memory", memoryRouter);
app.use("/api/v1/journal", journalRouter);
app.use("/api/v1/recommendations", recommendationRouter);
app.use("/api/v1/landmark", landmarkRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/packing", packingRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/badges", badgeRouter);
app.use("/api/v1/festivals", festivalRouter);
app.use("/api/v1/admin", adminRouter);

app.use("*", (req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Cannot find requested route ${req.originalUrl} on this server.`));
});

app.use(errorHandler);

export default app;
