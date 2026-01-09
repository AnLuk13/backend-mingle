import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *         - modelSrc
 *         - iOSSrc
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: Product name
 *           example: Modern Office Chair
 *         category:
 *           type: string
 *           description: Product category
 *           example: Furniture
 *         description:
 *           type: string
 *           description: Product description
 *           example: A comfortable ergonomic office chair
 *         price:
 *           type: number
 *           description: Product price
 *           example: 299.99
 *         currency:
 *           type: string
 *           description: Currency code
 *           default: USD
 *           example: USD
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *           example: 50
 *         color:
 *           type: string
 *           description: Product color
 *           example: Black
 *         dimensions:
 *           type: object
 *           properties:
 *             width:
 *               type: number
 *               example: 60
 *             length:
 *               type: number
 *               example: 60
 *             height:
 *               type: number
 *               example: 120
 *         modelSrc:
 *           type: string
 *           description: 3D model source URL
 *           example: https://example.com/models/chair.glb
 *         iOSSrc:
 *           type: string
 *           description: iOS USDZ model source URL
 *           example: https://example.com/models/chair.usdz
 *         annotations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slot:
 *                 type: string
 *               position:
 *                 type: string
 *               normal:
 *                 type: string
 *               orbit:
 *                 type: string
 *               target:
 *                 type: string
 *         brand:
 *           type: string
 *           description: Product brand
 *           example: ErgoTech
 *         discount:
 *           type: boolean
 *           description: Whether product is on discount
 *           default: false
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number, // Price field added
      required: true,
    },
    currency: {
      type: String,
      default: "USD", // Default currency
    },
    stock: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    dimensions: {
      width: Number,
      length: Number,
      height: Number,
    },
    modelSrc: {
      type: String,
      required: true,
    },
    iOSSrc: {
      type: String,
      required: true,
    },
    annotations: [
      {
        title: String,
        slot: String,
        position: String,
        normal: String,
        orbit: String,
        target: String,
      },
    ],
    brand: {
      type: String,
    },
    discount: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
