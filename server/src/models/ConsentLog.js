import mongoose from "mongoose";

const consentLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        "consent_given",
        "consent_withdrawn",
        "data_accessed",
        "data_deleted",
        "data_anonymized",
        "profile_updated"
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddressHash: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { versionKey: false }
);

export default mongoose.model("ConsentLog", consentLogSchema);
