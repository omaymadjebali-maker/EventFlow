import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("role").optional().isIn(["ADMIN", "ORGANIZER", "PARTICIPANT"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role: role || "PARTICIPANT" });

    return res.status(201).json({ id: user._id, email: user.email, role: user.role });
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  }
);

export default router;
