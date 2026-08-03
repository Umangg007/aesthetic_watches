import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  watchModel: { type: String },
  customNotes: { type: String, required: true },
  preferredContact: { type: String },
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

export const Request = mongoose.model('Request', requestSchema);
