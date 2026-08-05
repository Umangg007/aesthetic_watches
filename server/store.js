import { defaultProducts } from './defaultProducts.js';

export const globalStore = {
  users: [],
  products: [...defaultProducts],
  orders: [],
  requests: [],
  settings: {
    phone: '785238090',
    email: 'dharohar2026@gmail.com',
    announcement: '✦ Insured Express Delivery Across India ✦'
  }
};
