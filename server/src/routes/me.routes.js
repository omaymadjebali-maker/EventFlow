import { Router } from "express";
import { body, validationResult } from "express-validator";
import Event from "../models/Event.js";
import User from "../models/User.js";
import ConsentLog from "../models/ConsentLog.js";
import { requireAuth } from "../middlewares/auth.js";
import { anonymizeUser, logConsentAction } from "../services/gdpr.service.js";

const router = Router();

async function buildPersonalData(userId) {
  const [user, createdEvents, registeredEvents] = await Promise.all([
    User.findById(userId).select("-passwordHash").lean(),
    Event.find({ organizerId: userId }).sort({ date: 1 }).lean(),
    Event.find({ participants: userId }).sort({ date: 1 }).lean()
  ]);

  return { user, createdEvents, registeredEvents };
}

router.get("/data", requireAuth, async (req, res) => {
  const data = await buildPersonalData(req.user.id);
  if (!data.user) return res.status(404).json({ message: "User not found" });

  await logConsentAction({
    userId: req.user.id,
    action: "data_accessed",
    req,
    details: { source: "me_data" }
  });

  res.json(data);
});

router.put(
  "/data",
  requireAuth,
  body("email").optional().isEmail(),
  body("firstName").optional().isString().isLength({ max: 120 }),
  body("lastName").optional().isString().isLength({ max: 120 }),
  body("phone").optional({ nullable: true }).isString().isLength({ max: 40 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const allowedFields = ["email", "firstName", "lastName", "phone"];
    const patch = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        patch[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ message: "No allowed fields provided" });
    }

    if (patch.email) {
      patch.email = patch.email.toLowerCase();
      const existing = await User.findOne({ email: patch.email, _id: { $ne: req.user.id } }).lean();
      if (existing) return res.status(409).json({ message: "Email already used" });
    }

    const updated = await User.findByIdAndUpdate(req.user.id, patch, {
      new: true
    }).select("-passwordHash");

    if (!updated) return res.status(404).json({ message: "User not found" });

    await logConsentAction({
      userId: req.user.id,
      action: "profile_updated",
      req,
      details: {
        updatedFields: Object.keys(patch)
      }
    });

    res.json(updated);
  }
);

router.post("/withdraw-consent", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isAnonymized) return res.status(400).json({ message: "Account already anonymized" });

  user.consentWithdrawnAt = new Date();
  user.consentDate = null;
  user.consentVersion = null;
  await user.save();

  await logConsentAction({
    userId: req.user.id,
    action: "consent_withdrawn",
    req,
    details: {
      strategy: "immediate_anonymization"
    }
  });

  await anonymizeUser({
    userId: req.user.id,
    req,
    reason: "consent_withdrawn"
  });

  res.json({
    message: "Consent withdrawn and account anonymized"
  });
});

router.post("/anonymize", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isAnonymized) return res.status(400).json({ message: "Account already anonymized" });

  await anonymizeUser({
    userId: req.user.id,
    req,
    reason: "user_request"
  });

  res.json({
    message: "Account anonymized successfully"
  });
});

router.get("/consent-logs", requireAuth, async (req, res) => {
  const logs = await ConsentLog.find({ user: req.user.id })
    .sort({ timestamp: -1 })
    .select("action timestamp details")
    .lean();

  res.json(logs);
});

router.get("/export", requireAuth, async (req, res) => {
  const data = await buildPersonalData(req.user.id);
  if (!data.user) return res.status(404).json({ message: "User not found" });

  await logConsentAction({
    userId: req.user.id,
    action: "data_accessed",
    req,
    details: { source: "me_export" }
  });

  res.json({
    exportedAt: new Date().toISOString(),
    data
  });
});

export default router;
