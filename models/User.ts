import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  provider: {
    type: String,
    default: "signup",
  },
  credits: {
    type: Number,
    default: 0,
  },
  subscribed: { type: Boolean },
  isVerified: { type: Boolean, default: false },
  profileImage: {
    type: String,
    default: "",
  },
  
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
