import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: { type: Object, required: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    contact: { type: String },
    address: {
      address_line: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
    },
    totalPrice: { type: Number },
    deliveryDate: { type: String, default: Date.now() },
    createdAt: { type: String, default: Date.now() },
    status: { type: String, default: "Pending" },
    payment: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
