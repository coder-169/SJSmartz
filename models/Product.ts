import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String },
  stock: { type: Number, default: 1 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  slug: { type: String, unique: true },
  category: { type: String },
  images: [],
  rating: { type: Number, default: 0 },
  noOfReviews: { type: Number, default: 0 },
  variants: [
    {
      color: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
