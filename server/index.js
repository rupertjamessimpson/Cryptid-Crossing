import dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const prisma = new PrismaClient();

// Middleware to verify JWT token sent by the client
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

// Test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

  res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

  res.json({ id: user.id, username: user.username });
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// requireAuth middleware will validate the access token sent by the client and will return the user information within req.auth
app.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET route for fetching all shows
app.get("/shows", async (req, res) => {
  try {
    const shows = await prisma.show.findMany();
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shows" });
  }
});

// GET route for fetching one show
app.get("/shows/:id", async (req, res) => {
  try {
    const show = await prisma.show.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch show" });
  }
});

// POST route for creating a new show
app.post("/shows", async (req, res) => {
  const { image_url, description, venue, month, day, year, published } = req.body;

  if (!image_url || !description || !venue || !month || !day || !year || published === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newShow = await prisma.show.create({
      data: {
        image_url,
        description,
        venue,
        month,
        day,
        year,
        published,
      },
    });

    res.status(201).json(newShow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create show" });
  }
});

// Listening notification
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
