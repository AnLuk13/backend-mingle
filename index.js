import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import openAI from "./routes/openAI.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

export const app = express(); // prod

const PORT = process.env.PORT || 5000;
const MongoDBUrl = process.env.MongoDbURL;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mingle API",
      version: "1.0.0",
      description: "API documentation for Mingle e-commerce platform",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
      {
        url: "https://backend-mingle.vercel.app",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static("public"));

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(
  cors({
    origin: ["http://localhost:3000", "https://frontend-mingle.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Example route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to Mingle API");
});

// Handling API routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/openAI", openAI);

// MongoDB connection (for Vercel serverless)
if (process.env.VERCEL) {
  mongoose
    .connect(MongoDBUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Database connection error:", error));
}

// Export the Express app (for Vercel and dev server)
export default app;
