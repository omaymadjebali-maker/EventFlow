import { Router } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/rbac.js";

const router = Router();

router.get("/stats", requireAuth, allowRoles("ADMIN"), async (req, res) => {
  const [users, events, anonymizedUsers, roleDistribution, registrationsAgg, recentEventsRaw] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    User.countDocuments({ isAnonymized: true }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Event.aggregate([
      {
        $group: {
          _id: null,
          registrations: { $sum: { $size: "$participants" } }
        }
      }
    ]),
    Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("organizerId", "email")
      .lean()
  ]);

  const roles = {
    admins: 0,
    organizers: 0,
    participants: 0
  };

  for (const entry of roleDistribution) {
    if (entry._id === "ADMIN") roles.admins = entry.count;
    if (entry._id === "ORGANIZER") roles.organizers = entry.count;
    if (entry._id === "PARTICIPANT") roles.participants = entry.count;
  }

  const recentEvents = recentEventsRaw.map((event) => ({
    id: event._id,
    title: event.title,
    date: event.date,
    location: event.location,
    participantsCount: event.participants.length,
    organizer: {
      email: event.organizerId?.email || "Organisateur inconnu"
    }
  }));

  res.json({
    stats: {
      users,
      events,
      registrations: registrationsAgg[0]?.registrations || 0,
      anonymizedUsers
    },
    roleDistribution: roles,
    recentEvents
  });
});

export default router;
