import { Product } from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({ count: products.length, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};
