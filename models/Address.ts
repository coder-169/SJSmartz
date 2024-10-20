import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address_line: { type: String },
  city: { type: String },
  state: { type: String },
  postal_code: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
