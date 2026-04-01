import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "ORGANIZER", "PARTICIPANT"],
      default: "PARTICIPANT"
    },
    firstName: {
      type: String,
      default: ""
    },
    lastName: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    consentDate: {
      type: Date,
      default: null
    },
    consentVersion: {
      type: String,
      default: null
    },
    consentWithdrawnAt: {
      type: Date,
      default: null
    },
    isAnonymized: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
