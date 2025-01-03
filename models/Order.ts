import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: { type: Object, required: true },
    fullName: { type: String },
    contact: { type: String },
    address: {
      address_line: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      area: { type: String, required: true },
    },
    totalPayment: { type: Number },
    deliveryDate: { type: String, default: Date.now() },
    createdAt: { type: String, default: Date.now() },
    status: { type: String, default: "Pending" },
    payment: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "COD" },
    paymentScreenshot: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
