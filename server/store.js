import { defaultProducts } from './defaultProducts.js';

export const globalStore = {
  users: [],
  products: [...defaultProducts],
  orders: [],
  requests: []
};
