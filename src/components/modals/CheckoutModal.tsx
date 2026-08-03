import React from 'react';
import { Truck, X, ChevronRight, MapPin, CreditCard, ShieldCheck, CheckCircle2, Check } from 'lucide-react';
import type { CartItem, ShippingAddress, Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutStep: 1 | 2 | 3 | 4;
  setCheckoutStep: (s: 1 | 2 | 3 | 4) => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: (a: ShippingAddress) => void;
  paymentMethod: string;
  setPaymentMethod: (m: any) => void;
  cartItems: CartItem[];
  cartTotal: number;
  placedOrder: Order | null;
  handleCompleteOrder: () => void;
  setIsOrdersModalOpen: (v: boolean) => void;
  setToastMessage: (m: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen, onClose, checkoutStep, setCheckoutStep,
  shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod,
  cartItems, cartTotal, placedOrder, handleCompleteOrder,
  setIsOrdersModalOpen, setToastMessage
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-stone-900 rounded-2xl border border-amber-600/30 shadow-[0_0_60px_rgba(217,119,6,0.15)] my-auto p-5 md:p-8 max-h-[90vh] overflow-y-auto z-10">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-serif text-white flex items-center gap-2"><Truck className="text-amber-500" /> Home Delivery Pipeline</h2>
            <p className="text-stone-400 text-xs mt-1">Direct from Atelier to your doorstep</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X size={24} /></button>
        </div>
        {checkoutStep < 4 && (
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            {[{n:1,label:'Address'},{n:2,label:'Payment'},{n:3,label:'Review'}].map((s, i, arr) => (
              <React.Fragment key={s.n}>
                <div className={`flex items-center gap-2 text-xs uppercase tracking-wider ${checkoutStep >= s.n ? 'text-amber-500 font-bold' : 'text-stone-600'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${checkoutStep >= s.n ? 'border-amber-500 bg-amber-500/10' : 'border-stone-700'}`}>{s.n}</span>
                  {s.label}
                </div>
                {i < arr.length - 1 && <ChevronRight size={16} className="text-stone-700" />}
              </React.Fragment>
            ))}
          </div>
        )}
        {checkoutStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-white mb-2 flex items-center gap-2"><MapPin size={18} className="text-amber-500" /> Delivery Address Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Full Recipient Name</label>
                <input type="text" required placeholder="e.g. Pranshav Rathod" value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Mobile Number</label>
                <input type="tel" required placeholder="+91 98765 43210" value={shippingAddress.mobileNumber}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, mobileNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">House / Flat / Building / Street Address</label>
              <textarea rows={2} required placeholder="Enter complete street address" value={shippingAddress.flatAddress}
                onChange={(e) => setShippingAddress({ ...shippingAddress, flatAddress: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{label:'Pincode',key:'pincode',ph:'380015'},{label:'City',key:'city',ph:'Ahmedabad'},{label:'State',key:'state',ph:'Gujarat'}].map((f: any) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">{f.label}</label>
                  <input type="text" required placeholder={f.ph} value={(shippingAddress as any)[f.key]}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, [f.key]: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => {
                if (!shippingAddress.fullName || !shippingAddress.flatAddress || !shippingAddress.city || !shippingAddress.pincode) {
                  setToastMessage("Please fill in required address fields."); setTimeout(() => setToastMessage(""), 3000); return;
                }
                setCheckoutStep(2);
              }} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-xs flex items-center gap-2 transition-colors">
                Continue to Payment <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        {checkoutStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-white flex items-center gap-2"><CreditCard size={18} className="text-amber-500" /> Payment Selection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {id:'upi',label:'UPI (GPay / PhonePe / Paytm)',desc:'Instant approval via UPI ID or QR scan'},
                {id:'card',label:'Credit / Debit Card',desc:'Visa, MasterCard, RuPay, Amex'},
                {id:'netbanking',label:'Net Banking',desc:'All major Indian banks supported'},
                {id:'cod',label:'Cash on Delivery (COD)',desc:'Pay upon home delivery inspection'},
              ].map(m => (
                <div key={m.id} onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === m.id ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{m.label}</span>
                    {paymentMethod === m.id && <Check size={18} className="text-amber-500" />}
                  </div>
                  <p className="text-xs text-stone-400">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button onClick={() => setCheckoutStep(1)} className="text-stone-400 hover:text-white text-xs uppercase tracking-wider py-3">Back to Address</button>
              <button onClick={() => setCheckoutStep(3)} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-xs flex items-center gap-2 transition-colors">
                Review Order <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        {checkoutStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-white flex items-center gap-2"><ShieldCheck size={18} className="text-amber-500" /> Review Order & Home Delivery</h3>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-stone-400">Recipient:</span>
                <span className="text-white font-medium">{shippingAddress.fullName} ({shippingAddress.mobileNumber})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-stone-400">Delivery Address:</span>
                <span className="text-white text-right max-w-xs">{shippingAddress.flatAddress}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Selected Payment:</span>
                <span className="text-amber-400 font-bold uppercase">{paymentMethod}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-stone-950 p-2.5 rounded-lg border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-stone-800" />
                    <div>
                      <span className="text-white font-medium block">{item.name}</span>
                      <span className="text-stone-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-amber-500 font-bold">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bg-stone-950 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-stone-400"><span>Watch Collection Total</span><span>₹ {cartTotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-xs text-stone-400"><span>Insured Home Courier</span><span className="text-amber-500">FREE / Included</span></div>
              <div className="flex justify-between text-base font-serif text-white font-bold pt-2 border-t border-white/10">
                <span>Final Amount</span><span className="text-amber-400">₹ {cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-between">
              <button onClick={() => setCheckoutStep(2)} className="text-stone-400 hover:text-white text-xs uppercase tracking-wider py-3">Back to Payment</button>
              <button onClick={handleCompleteOrder} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-4 rounded-lg uppercase tracking-wider text-xs flex items-center gap-2 transition-colors shadow-xl">
                <CheckCircle2 size={18} /> Confirm & Dispatch Order
              </button>
            </div>
          </div>
        )}
        {checkoutStep === 4 && placedOrder && (
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 mb-2">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-white mb-2">Order Confirmed!</h3>
              <p className="text-stone-400 text-sm">Your order <span className="text-amber-400 font-mono font-bold">#{placedOrder.orderId}</span> has been dispatched to production.</p>
            </div>
            <div className="bg-stone-950 p-6 rounded-2xl border border-amber-600/30 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 block">Expected Home Delivery</span>
                  <span className="text-amber-400 font-serif font-bold text-lg">{placedOrder.estimatedDelivery}</span>
                </div>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Home Express Delivery</span>
              </div>
              <div className="space-y-4 py-2">
                {placedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500 border border-stone-700'}`}>
                        {idx === 0 ? <Check size={14} /> : idx + 1}
                      </div>
                      {idx < placedOrder.timeline.length - 1 && <div className={`w-0.5 h-6 mt-1 ${idx === 0 ? 'bg-amber-500/50' : 'bg-stone-800'}`}></div>}
                    </div>
                    <div>
                      <h5 className={`text-sm font-medium ${idx === 0 ? 'text-white' : 'text-stone-400'}`}>{step.title}</h5>
                      <span className="text-xs text-stone-500">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => { onClose(); setIsOrdersModalOpen(true); }}
                className="bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-600/30 px-6 py-3 rounded-lg uppercase tracking-wider text-xs font-bold transition-colors">
                View All Orders & Tracking
              </button>
              <button onClick={onClose} className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-lg uppercase tracking-wider text-xs transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
