import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    zipcode: { type: Number },

}, {timestamps: true});

export default mongoose.models.User || mongoose.model('User', UserSchema);
