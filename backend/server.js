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

// Public routes
app.get("/health", (req, res) => res.json({ status: "healthy", timestamp: new Date() }));
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
  console.error("Express Error Handler:", err);
  res.status(500).json({ error: "Something went wrong internally." });
});

app.listen(PORT, () => {
  console.log(`CraveGo Express Server running on port ${PORT}`);
});
