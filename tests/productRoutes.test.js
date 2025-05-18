import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

describe("GET /products", () => {
  beforeAll(async () => {
    console.log("🔥 Connecting to Database...");
    await mongoose.connect(process.env.MongoDbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    console.log("🛑 Closing Database Connection...");
    await mongoose.connection.close();
  });

  it("should return a list of products", async () => {
    console.log("📡 Sending GET request to /products...");
    const response = await request(app).get("/products");

    console.log("✅ Checking response status...");
    expect(response.status).toBe(200);

    console.log("🔍 Checking response structure...");
    expect(response.body).toHaveProperty("count");
    expect(Array.isArray(response.body.data)).toBe(true);

    console.log("🎉 Test Passed!");
  });
});
