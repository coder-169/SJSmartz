import mongoose from "mongoose";

const ReferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    credits: {
      type: Number,
      default: 0,
    },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Refer || mongoose.model("Refer", ReferSchema);
