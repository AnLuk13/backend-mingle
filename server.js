import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./index.js";
import open from "open";

// Development server only - not used in production (Vercel)
dotenv.config();

const PORT = process.env.PORT || 5000;
const MongoDBUrl = process.env.MongoDbURL;

mongoose
  .connect(MongoDBUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
      // Auto-open Swagger docs in browser
      open(`http://localhost:${PORT}/docs`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  });
