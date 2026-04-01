import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";
import { logConsentAction } from "../services/gdpr.service.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await logConsentAction({
      userId: req.user.id,
      action: "data_accessed",
      req,
      details: { source: "users_me" }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
