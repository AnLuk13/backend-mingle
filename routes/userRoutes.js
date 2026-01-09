import { User } from "../models/userModel.js";
import express from "express";
import { Product } from "../models/productModel.js";

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users with populated wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserWithPopulatedWishlist'
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found with populated wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithPopulatedWishlist'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// put request by id
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// delete request by id
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @openapi
 * /users/{userId}/wishlist:
 *   put:
 *     tags:
 *       - Users
 *     summary: Add or remove product from user wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add or remove from wishlist
 *     responses:
 *       200:
 *         description: Wishlist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithPopulatedWishlist'
 *       400:
 *         description: Product ID is required
 *       401:
 *         description: User ID is missing or not logged in
 *       404:
 *         description: User or product not found
 *       500:
 *         description: Server error
 */
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
        { new: true } // Return the updated user document
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } }, // $addToSet ensures no duplicates
        { new: true } // Return the updated user document
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
