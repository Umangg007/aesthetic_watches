import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2, Truck, CreditCard } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  updateQuantity: (id: number | string, delta: number) => void;
  removeFromCart: (id: number | string) => void;
  startCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, cartTotal, updateQuantity, removeFromCart, startCheckout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[55] flex justify-end">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-stone-900 h-full shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-serif text-white flex items-center gap-2"><ShoppingBag className="text-amber-500" /> Your Collection</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your collection is empty.</p>
              <button onClick={onClose} className="text-amber-500 underline text-sm mt-4">Continue Exploring</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-stone-950/50 p-3 rounded-lg border border-white/5">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded bg-stone-800"
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23292524'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='10' text-anchor='middle' fill='%23a8a29e' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }} />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-serif text-sm leading-tight mb-1">{item.name}</h4>
                    <p className="text-amber-500 font-bold text-sm">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-stone-900 rounded border border-white/10 px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-400 hover:text-white"><Minus size={14} /></button>
                      <span className="text-sm w-4 text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-400 hover:text-white"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-stone-950">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-400 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="text-xl font-serif text-white font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-xs mb-4 bg-stone-900 p-2 rounded border border-white/5">
              <Truck size={16} className="text-amber-500" />
              <span>Complimentary Insured Home Delivery Included</span>
            </div>
            <button onClick={startCheckout} className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 py-4 rounded-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg">
              <CreditCard size={20} /> Proceed to Home Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
