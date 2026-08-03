import React from 'react';
import { Package, X } from 'lucide-react';
import type { Order } from '../../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userOrders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, userOrders }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-stone-900 rounded-2xl border border-amber-600/30 shadow-2xl p-6 md:p-8 z-10 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-serif text-white flex items-center gap-2"><Package className="text-amber-500" /> My Orders & Delivery Tracking</h2>
            <p className="text-stone-400 text-xs mt-1">Track home delivery packages and order history</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X size={24} /></button>
        </div>
        {userOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-500 space-y-3">
            <Package size={48} className="mx-auto opacity-30" />
            <p className="text-stone-400 text-sm">No active home delivery orders found.</p>
            <button onClick={onClose} className="text-amber-500 underline text-xs">Browse Watch Collection</button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((ord, idx) => (
              <div key={idx} className="bg-stone-950 rounded-xl p-5 border border-white/10 space-y-4">
                <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-3 gap-2">
                  <div><span className="text-xs text-stone-500 block">Order ID</span><span className="text-amber-400 font-mono font-bold text-sm">#{ord.orderId}</span></div>
                  <div><span className="text-xs text-stone-500 block">Placed On</span><span className="text-stone-300 text-xs">{ord.date}</span></div>
                  <div><span className="text-xs text-stone-500 block">Total</span><span className="text-white font-bold text-sm">₹ {ord.totalAmount.toLocaleString('en-IN')}</span></div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">{ord.status}</span>
                </div>
                <div className="space-y-2">
                  {ord.items.map((it, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between items-center text-xs text-stone-300">
                      <span>{it.name} (x{it.quantity})</span>
                      <span className="text-amber-500">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-stone-900/60 p-3 rounded-lg border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-stone-400">Home Delivery Address:</span><span className="text-white font-medium">{ord.address.city}, {ord.address.state} ({ord.address.pincode})</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Est. Home Delivery:</span><span className="text-amber-400 font-bold">{ord.estimatedDelivery}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
