import mongoose from "mongoose";

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
  },
);

export const User = mongoose.model("User", userSchema);
