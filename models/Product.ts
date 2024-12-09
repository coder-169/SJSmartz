import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discount: { type: Number, default: 0 },
  slug: { type: String, unique: true },
  category: { type: String },
  subCategory: { type: String },
  images: [],
  rating: {
    type: Number,
    default: 0,
    min: 0, // Minimum rating value
    max: 5, // Maximum rating value
  },
  noOfReviews: { type: Number, default: 0 },
  brand: { type: String, default: "No Brand" },
  description: { type: String },
  freeDelivery: { type: Boolean, default: false },
  condition: { type: String, default: "New" },
  model: { type: String, default: new Date().getFullYear() },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
