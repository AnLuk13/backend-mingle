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
  return `The user provided the following request: "${message}". 

Based on this request, create a MongoDB filter object to find matching products in a database.

The product schema includes the following relevant fields:
{
  name: String,          // Product name
  category: String,      // Category or subcategory
  description: String,   // Product description
  price: Double,         // Numeric price
  currency: String,      // Currency code
  color: String,         // Color name
  dimensions: Object,    // Product dimensions
  brand: String,         // Brand name
  discount: Boolean,     // Whether it's discounted
  createdAt: Date,       // Creation date
  updatedAt: Date        // Last updated
}

The available categories and subcategories are:
- Furniture
  • Office Furniture
  • Outdoor Furniture
  • Living Room Furniture
  • Bedroom Furniture
- Home Decor
  • Vases
  • Paintings
  • Decorative Items
- Art
  • Paintings
  • Sculptures
  • Art Prints
- Environment
  • Planters
  • Pots
  • Garden Accessories

Filter construction rules:
- If the user specifies a subcategory (e.g., "Office Furniture"), use its parent category ("Furniture") in the filter.
- For category matching, use:
  { category: { $regex: "Furniture", $options: "i" } }
- For name, description, or text-based queries, use:
  - { $text: { $search: "<term>" } } — if both name and description should be searched
  - Or use $regex with $options: "i" for partial, case-insensitive match
- For price ranges, use:
  { price: { $gte: <min>, $lte: <max> } }
- For color and brand, use:
  { color: { $regex: "^<color>$", $options: "i" } }
  { brand: { $regex: "^<brand>$", $options: "i" } }
- For discounts:
  { discount: true } or { discount: false }

If the request is too vague, ask for specifics like price range, category, brand, or color.

Strict rules:
- Return only the MongoDB filter JSON object.
- No explanations.
- No text outside the JSON.
- No Markdown code block with backticks.
- Output must be pure JSON, starting directly with { and ending with }

Always return a valid JSON MongoDB filter object.`;
};

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a product recommendation assistant for an e-commerce platform and a MongoDB expert. Your task is to generate MongoDB filter objects based on user queries. Respond only with a valid JSON object. Do not explain anything.",
        },
        { role: "user", content: createFilterPrompt(message) },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const gptFilterResponse = gptResponse.choices[0].message.content.trim();
    console.log(gptFilterResponse);

    // Attempt to parse the response as JSON for the filter
    let filter;
    try {
      filter = JSON.parse(gptFilterResponse);
      console.log("filtered", filter);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to process your request. Please provide more specific details such as:",
        suggestions: [
          "Product category (e.g., Furniture, Home Decor, Art)",
          "Price range",
          "Color preferences",
          "Brand preferences",
          "Specific features or requirements",
        ],
      });
    }

    // Query the database for products matching the filter
    const products = await Product.find(filter);

    if (products.length > 0) {
      res.json({
        success: true,
        count: products.length,
        products,
      });
    } else {
      res.status(404).json({
        success: false,
        message:
          "No products match your criteria. Try adjusting your search by:",
        suggestions: [
          "Broadening your price range",
          "Using more general category terms",
          "Removing specific constraints (like color or brand)",
          "Checking for typos in brand names or categories",
        ],
      });
    }
  } catch (error) {
    console.error("Error with GPT recommendation:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
