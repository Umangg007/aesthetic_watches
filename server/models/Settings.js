import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  phone: { type: String, default: '785238090' },
  email: { type: String, default: 'dharohar2026@gmail.com' },
  announcement: { type: String, default: '✦ Insured Express Delivery Across India ✦' }
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
