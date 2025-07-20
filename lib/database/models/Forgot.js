import mongoose from "mongoose";

const forgotSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Forgot = mongoose.models.Forgot || mongoose.model("Forgot", forgotSchema);

export default Forgot;
