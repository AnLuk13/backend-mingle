import express from "express";
import openai from "openai";
import { Product } from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config(); // Pentru a putea accesa cheile din .env

const router = express.Router();

openai.apiKey = process.env.OPENAI_API_KEY; // Setăm cheia OpenAI

// Funcție care generează un prompt GPT pentru a obține un filtru valid
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
    const { message } = req.body; // Mesajul utilizatorului

    // Trimiterea inputului utilizatorului la modelul GPT pentru interpretare și generarea unui filtru
    const gptResponse = await openai.Completion.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a product recommendation assistant for an e-commerce platform.",
        },
        { role: "user", content: createFilterPrompt(message) }, // Generăm promptul din cererea utilizatorului
      ],
      max_tokens: 100,
    });

    const gptFilterResponse = gptResponse.choices[0].message.content.trim();

    // Verificăm dacă GPT a returnat un filtru valid (JSON)
    let filter;
    try {
      filter = JSON.parse(gptFilterResponse); // Încercăm să transformăm răspunsul GPT într-un obiect JSON
    } catch (error) {
      return res.status(400).json({
        message:
          "Asistentul nu a putut genera un filtru valid. Vă rugăm să furnizați mai multe detalii despre ceea ce doriți.",
      });
    }

    // Căutăm produsele din baza de date folosind filtrul generat de GPT
    const products = await Product.find(filter);

    // Verificăm dacă au fost găsite produse
    if (products.length > 0) {
      res.json(products); // Returnăm produsele în format JSON
    } else {
      res.json({
        message:
          "Nu au fost găsite produse care să corespundă cerințelor specificate.",
      });
    }
  } catch (error) {
    console.error("Eroare la recomandările GPT:", error.message);
    res.status(500).json({
      message: "Eroare la prelucrarea cererii. Vă rugăm să încercați din nou.",
    });
  }
});

export default router;
