import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./index.js";

// development only
dotenv.config();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MongoDbURL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });
