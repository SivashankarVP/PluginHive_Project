import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./awsClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "cravego-super-secret-key-12345";

export const register = async (req, res) => {
  const { name, username, email, password, phone, city } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const users = await db.scan({ TableName: "Users" });
    const existing = users.find(
      (u) => u.username === username || u.email === email
    );

    if (existing) {
      return res.status(400).json({ message: "Username or Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      name,
      username,
      email,
      password: hashedPassword,
      phone: phone || "",
      city: city || "",
      createdAt: new Date().toISOString(),
    };

    await db.put({ TableName: "Users", Item: newUser });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const users = await db.scan({ TableName: "Users" });
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to authenticate requests
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Token Required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

export const getProfile = async (req, res) => {
  try {
    const users = await db.scan({ TableName: "Users" });
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, phone, city } = req.body;

  try {
    const users = await db.scan({ TableName: "Users" });
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = {
      ...user,
      name: name || user.name,
      phone: phone !== undefined ? phone : user.phone,
      city: city !== undefined ? city : user.city,
    };

    await db.put({ TableName: "Users", Item: updatedUser });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
