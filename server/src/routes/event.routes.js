import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import Event from "../models/Event.js";
import { requireAuth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/rbac.js";

const router = Router();

// Public list
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 }).lean();
  res.json(events);
});

// Create (ORGANIZER or ADMIN)
router.post(
  "/",
  requireAuth,
  allowRoles("ADMIN", "ORGANIZER"),
  body("title").isString().isLength({ min: 3, max: 120 }),
  body("description").optional().isString().isLength({ max: 2000 }),
  body("date").isISO8601(),
  body("location").isString().isLength({ min: 2, max: 200 }),
  body("capacity").isInt({ min: 1, max: 100000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, date, location, capacity } = req.body;

    const event = await Event.create({
      title,
      description: description || "",
      date: new Date(date),
      location,
      capacity: Number(capacity),
      remainingSeats: Number(capacity),
      organizerId: req.user.id,
      participants: []
    });

    res.status(201).json(event);
  }
);

// Update (ADMIN OR owner ORGANIZER)
router.put(
  "/:id",
  requireAuth,
  allowRoles("ADMIN", "ORGANIZER"),
  param("id").isMongoId(),
  body("title").optional().isString().isLength({ min: 3, max: 120 }),
  body("description").optional().isString().isLength({ max: 2000 }),
  body("date").optional().isISO8601(),
  body("location").optional().isString().isLength({ min: 2, max: 200 }),
  body("capacity").optional().isInt({ min: 1, max: 100000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = event.organizerId.toString() === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: "Forbidden" });

    const patch = {};
    for (const key of ["title", "description", "location"]) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (req.body.date) patch.date = new Date(req.body.date);

    if (req.body.capacity !== undefined) {
      const newCap = Number(req.body.capacity);
      const used = event.capacity - event.remainingSeats;
      if (newCap < used) return res.status(400).json({ message: "Capacity < already registered" });
      patch.capacity = newCap;
      patch.remainingSeats = newCap - used;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, patch, { new: true });
    res.json(updated);
  }
);

// Delete (ADMIN OR owner ORGANIZER)
router.delete(
  "/:id",
  requireAuth,
  allowRoles("ADMIN", "ORGANIZER"),
  param("id").isMongoId(),
  async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = event.organizerId.toString() === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: "Forbidden" });

    await Event.deleteOne({ _id: req.params.id });
    res.status(204).send();
  }
);

// Register (one-click inscription)
router.post(
  "/:id/register",
  requireAuth,
  param("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user.id;

    if (event.participants.map(String).includes(userId)) {
      return res.status(409).json({ message: "Already registered" });
    }
    if (event.remainingSeats <= 0) {
      return res.status(400).json({ message: "No seats left" });
    }

    event.participants.push(userId);
    event.remainingSeats -= 1;
    await event.save();

    res.json({ message: "Registered", remainingSeats: event.remainingSeats });
  }
);

export default router;
