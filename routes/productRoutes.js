import { Product } from "../models/productModel.js";
import express from "express";

const router = express.Router();

//post a product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, stock, modelSrc, iOSSrc } = req.body;
    if (
      !name ||
      !category ||
      !price ||
      stock === undefined ||
      !modelSrc ||
      !iOSSrc
    ) {
      return res
        .status(400)
        .json({
          message:
            "Please provide all required fields: name, category, price, stock, modelSrc, and iOSSrc.",
        });
    }
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ count: products.length, data: products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//get product by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//update a product by id
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    // Validate required fields
    if (!name || !category || !price || stock === undefined) {
      return res
        .status(400)
        .send(
          "Please provide all required fields: name, category, price, stock.",
        );
    }
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    return res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

export default router;
