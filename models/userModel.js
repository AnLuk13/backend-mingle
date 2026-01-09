import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (unique)
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: User's password (hashed in practice)
 *           example: mySecurePassword123
 *         wishlist:
 *           type: array
 *           description: Array of product IDs in user's wishlist
 *           items:
 *             type: string
 *             description: Product ID reference
 *             example: 507f1f77bcf86cd799439011
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     UserWithPopulatedWishlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         wishlist:
 *           type: array
 *           description: Populated product objects
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Each user must have a unique email
    },
    password: {
      type: String,
      required: true,
      select: false, // 👈 automatically excluded
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to products in the wishlist
        ref: "Product", // Refers to the 'Product' model
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
