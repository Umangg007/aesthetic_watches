import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const timelineSchema = new mongoose.Schema({
  title: String,
  time: String,
  completed: Boolean
});

const addressSchema = new mongoose.Schema({
  fullName: String,
  mobileNumber: String,
  pincode: String,
  flatAddress: String,
  landmark: String,
  city: String,
  state: String,
  deliveryNotes: String
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  date: { type: String },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  address: addressSchema,
  paymentMethod: { type: String },
  status: { type: String },
  deliveryStatus: { type: String },
  estimatedDelivery: { type: String },
  timeline: [timelineSchema],
  userEmail: { type: String, index: true } // Associated user email index for fast lookup
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
