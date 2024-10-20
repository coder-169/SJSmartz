import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
});

export default mongoose.models.Variant || mongoose.model('Variant', VariantSchema);
