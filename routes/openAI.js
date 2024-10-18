import express from 'express';
import openai from 'openai';
import {Product} from "../models/productModel.js"; // Presupunem că avem deja configurat openai client

const router = express.Router();

// Configurarea clientului GPT
openai.apiKey = process.env.OPENAI_API_KEY;

router.post('/assistant', async (req, res) => {
    try {
        const { message } = req.body; // Mesajul utilizatorului

        // Trimiterea inputului utilizatorului la modelul GPT pentru interpretare
        const gptResponse = await openai.Completion.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a product recommendation assistant for an e-commerce platform." },
                { role: "user", content: message }
            ],
            max_tokens: 100,
        });

        const gptFilter = gptResponse.choices[0].message.content.trim();

        // Verificăm dacă GPT a returnat un filtru valid
        let filter = {};

        try {
            filter = JSON.parse(gptFilter); // Încercăm să transformăm răspunsul GPT în obiect JSON (filtru)
        } catch (error) {
            return res.status(400).json({ message: "Asistentul nu a putut genera un filtru valid. Vă rugăm să reformulați cererea." });
        }

        // Căutăm produsele din baza de date folosind filtrul generat de GPT
        const products = await Product.find(filter);

        // Verificăm dacă au fost găsite produse
        if (products.length > 0) {
            res.json(products); // Returnăm produsele în format JSON
        } else {
            res.json({ message: "Nu au fost găsite produse care să corespundă cerințelor specificate." });
        }

    } catch (error) {
        console.error('Eroare la recomandările GPT:', error.message);
        res.status(500).json({ message: 'Eroare la prelucrarea cererii. Vă rugăm să încercați din nou.' });
    }
});

export default router;
