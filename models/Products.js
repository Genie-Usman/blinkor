import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, }, // Store discount in percentage (e.g., 20 for 20%)
  variants: [
    {
      size: { type: String, required: true },
      color: { type: String, required: true },
      image: { type: String, required: true, default: 0 },
      availableQuantity: { type: Number, required: true, default: 0 },
    },
  ],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
