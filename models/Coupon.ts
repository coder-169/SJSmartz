import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  uses: { type: Number, default: 0 },
});

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
