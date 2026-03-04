import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDB(process.env.MONGO_URI);
  const app = createApp();
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Boot error:", e);
  process.exit(1);
});
