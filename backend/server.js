import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { register, login, getProfile, updateProfile, authenticateToken } from "./auth.js";
import { getRestaurants, getMenuByRestaurant } from "./restaurantController.js";
import { placeOrder, getOrderHistory } from "./orderController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// CloudWatch-style structured request logging (simulates what CloudWatch captures in production)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      service: "CraveGo-Backend",
    };
    console.log(JSON.stringify(log));
  });
  next();
});

// Health check — shows AWS service connectivity status
app.get("/health", (req, res) => {
  const useMock = process.env.USE_AWS_MOCK !== "false";
  res.json({
    status: "healthy",
    timestamp: new Date(),
    environment: useMock ? "local-mock" : "aws-production",
    services: {
      dynamodb: useMock ? "mock" : "connected",
      s3: useMock ? "mock" : "connected",
      ses: useMock ? "mock" : "connected",
      sqs: useMock ? "mock" : "connected",
      sns: useMock ? "mock" : "connected",
      redis: useMock ? "in-memory-mock" : "elasticache",
    },
  });
});

// Public routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/restaurants", getRestaurants);
app.get("/api/menu", getMenuByRestaurant);

// Protected routes
app.get("/api/auth/me", authenticateToken, getProfile);
app.put("/api/auth/profile", authenticateToken, updateProfile);
app.post("/api/orders", authenticateToken, placeOrder);
app.get("/api/orders", authenticateToken, getOrderHistory);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message: err.message,
    stack: err.stack,
    service: "CraveGo-Backend",
  }));
  res.status(500).json({ error: "Something went wrong internally." });
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "INFO",
    message: `CraveGo Express Server running on port ${PORT}`,
    service: "CraveGo-Backend",
    environment: process.env.USE_AWS_MOCK !== "false" ? "local-mock" : "aws-production",
  }));
});

