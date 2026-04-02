import crypto from "crypto";
import bcrypt from "bcryptjs";
import ConsentLog from "../models/ConsentLog.js";
import User from "../models/User.js";

function getRequestIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function hashIpAddress(ipAddress) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required to hash personal data safely");
  }

  return crypto
    .createHash("sha256")
    .update(`${secret}:${ipAddress}`)
    .digest("hex");
}

export async function logConsentAction({ userId, action, req, details = null }) {
  if (!userId) return null;

  return await ConsentLog.create({
    user: userId,
    action,
    ipAddressHash: hashIpAddress(getRequestIp(req)),
    details
  });
}

export async function anonymizeUser({ userId, req, reason = "manual_anonymization" }) {
  const user = await User.findById(userId);
  if (!user) return null;

  if (user.isAnonymized) {
    return user;
  }

  const anonymizedEmail = `anonymized_${user._id}_${Date.now()}@deleted.local`;
  const randomPassword = crypto.randomBytes(32).toString("hex");
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  user.email = anonymizedEmail;
  user.firstName = "ANONYMIZED";
  user.lastName = "ANONYMIZED";
  user.phone = "";
  user.passwordHash = passwordHash;
  user.isAnonymized = true;
  user.consentDate = null;
  user.consentVersion = null;

  await user.save();

  await logConsentAction({
    userId: user._id,
    action: "data_anonymized",
    req,
    details: { reason }
  });

  return user;
}
