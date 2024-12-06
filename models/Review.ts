import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    images: [],
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    avatar: { type: String,  },
    email: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
