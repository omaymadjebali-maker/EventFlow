import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    capacity: { type: Number, required: true, min: 1 },
    remainingSeats: { type: Number, required: true, min: 0 },

    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
