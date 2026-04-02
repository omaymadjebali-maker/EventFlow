import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function bootstrap() {
  const mongoUri = requireEnv("MONGO_URI");
  requireEnv("JWT_SECRET");
  requireEnv("CORS_ORIGIN");

  await connectDB(mongoUri);
  const app = createApp();
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Boot error:", e);
  process.exit(1);
});
