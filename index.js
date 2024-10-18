import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import openAI from "./routes/openAI.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const MongoDBUrl = process.env.MongoDbURL;
const PORT = process.env.PORT || 5555;

app.use(express.static("public"));

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    })
);

// Example route
app.get("/", (req, res) => {
    return res.status(200).send("Welcome");
});

// Handling API routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/openAI", openAI);

// Mongoose connection to MongoDB
mongoose
    .connect(MongoDBUrl)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });

// Export the Express app for Vercel to handle it
export default app;
