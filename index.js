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
const PORT = process.env.PORT || 5555;

app.use(express.static("public"));

//middleware for parsing request body
app.use(express.json());

//middleware for handling cors policy
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

//example
app.get("/", (req, res) => {
  return res.status(200).send("Welcome");
});

//handling of api routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/openAI", openAI);

mongoose
  .connect(`${process.env.MongoDBUrl}`)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("Listening to port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
