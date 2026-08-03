// ─── Shared TypeScript Interfaces ─────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  region: string;
  category: string;
  price: number;
  priceStr: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  region: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  role?: 'user' | 'admin';
}

export interface ShippingAddress {
  fullName: string;
  mobileNumber: string;
  pincode: string;
  flatAddress: string;
  landmark: string;
  city: string;
  state: string;
  deliveryNotes: string;
}

export interface OrderTimeline {
  title: string;
  time: string;
  completed: boolean;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  address: ShippingAddress;
  paymentMethod: string;
  status: string;
  deliveryStatus: string;
  estimatedDelivery: string;
  timeline: OrderTimeline[];
}

export interface ContactForm {
  name: string;
  phone: string;
  email: string;
  watchModel: string;
  customNotes: string;
  preferredContact: string;
}

export interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type Page = 'home' | 'about' | 'admin';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type AuthTab = 'login' | 'signup';
export type ViewAngle = 'front' | 'side' | 'back' | 'strap';
