import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceStr: { type: String, required: true },
  image: { type: String, required: true },
  region: { type: String, required: true },
  category: { type: String, required: true }
});

export const Product = mongoose.model('Product', productSchema);
