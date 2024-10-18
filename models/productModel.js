import mongoose from "mongoose";

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
  },
);

export const Product = mongoose.model("Product", productSchema);
