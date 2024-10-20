import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discount: { type: Number, default: 0 },
  slug: { type: String, unique: true },
  category: { type: String },
  subCategory: { type: String },
  images: [],
  rating: { type: Number, default: 0 },
  noOfReviews: { type: Number, default: 0 },
  brand: { type: String, default: "No Brand" },
  description: { type: String },
  condition: { type: String, default: "New" },
  model: { type: String, default: new Date().getFullYear() },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
