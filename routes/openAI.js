import express from "express";
import OpenAI from "openai"; // Corrected import
import { Product } from "../models/productModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your actual API key
});

// Function to generate prompt for GPT
const createFilterPrompt = (message) => {
  return `
    The user provided the following request: "${message}". 
    Based on this request, create a MongoDB filter object that can be used to find matching products in a database.
    The product has the following structure: {
        _id: ObjectId,
        name: String,
        category: String,
        description: String,
        price: Double,
        currency: String,
        stock: Int32,
        color: String,
        dimensions: Object,
        modelSrc: String,
        iOSSrc: String,
        annotations: Array,
        brand: String,
        discount: Boolean,
        createdAt: Date,
        updatedAt: Date,
        __v: Int32
    }.
    The filter should match fields such as "name", "category", "price", "color", and "brand".
    If the request is too vague, provide feedback to the user requesting more specific information. 
    Always respond in the language in which the user asked the question.
    Return a valid JSON filter object.
  `;
};

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // Sending the user input to GPT for processing and generating a filter
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a product recommendation assistant for an e-commerce platform.",
        },
        { role: "user", content: createFilterPrompt(message) },
      ],
      max_tokens: 200,
    });

    const gptFilterResponse = gptResponse.choices[0].message.content.trim();

    // Attempt to parse the response as JSON for the filter
    let filter;
    try {
      filter = JSON.parse(gptFilterResponse);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid filter generated. Please provide more details.",
      });
    }

    // Query the database for products matching the filter
    const products = await Product.find(filter);

    if (products.length > 0) {
      res.json(products);
    } else {
      res.json({ message: "No matching products found." });
    }
  } catch (error) {
    console.error("Error with GPT recommendation:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
