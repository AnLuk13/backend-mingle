import { User } from "../models/userModel.js";
import express from "express";
import { Product } from "../models/productModel.js";

const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).populate("wishlist");
    return res.status(200).json({ count: users.length, data: users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//get user by id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
});

//post a user
router.post("/", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("Error sending body");
    }
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

//edit users wishlist
router.put("/:userId/wishlist", async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  if (!userId) {
    return res
      .status(401)
      .json({ message: "User ID is missing or not logged in." });
  }

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isProductInWishlist = user.wishlist.includes(productId);
    let updatedUser;
    if (isProductInWishlist) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } }, // $pull removes the item from wishlist
        { new: true }, // Return the updated user document
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } }, // $addToSet ensures no duplicates
        { new: true }, // Return the updated user document
      );
    }
    await updatedUser.populate("wishlist");
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred: " + error.message });
  }
});

export default router;
