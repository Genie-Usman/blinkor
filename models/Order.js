import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  stripeSessionId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerZipCode: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerCity: { type: String, required: true },
  customerDistrict: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
