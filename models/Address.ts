import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address_name: { type: String, default: "Home" },
  address_line: { type: String },
  city: { type: String },
  state: { type: String },
  area: { type: String },
});

export default mongoose.models.Address || mongoose.model("Address", AddressSchema);
