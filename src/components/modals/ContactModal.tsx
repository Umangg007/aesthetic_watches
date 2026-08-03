import React from 'react';
import { X, Phone, Mail, Send } from 'lucide-react';
import type { Product, ContactForm } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactForm: ContactForm;
  setContactForm: (f: ContactForm) => void;
  handleContactSubmit: (e: React.FormEvent) => void;
  productList: Product[];
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contactForm, setContactForm, handleContactSubmit, productList }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-stone-900 rounded-2xl border border-amber-600/40 shadow-[0_0_60px_rgba(217,119,6,0.2)] p-5 md:p-8 max-h-[90vh] overflow-y-auto z-10">
        <button onClick={onClose} className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors">
          <X size={22} />
        </button>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-serif text-white">Custom Watch Consultation</h3>
          <p className="text-stone-400 text-xs mt-1 mb-4">Want to customize a watch? Send your bespoke request directly to our master artisans.</p>
        </div>
        <div className="bg-stone-950 p-3 rounded-xl border border-amber-600/30 flex flex-wrap justify-around text-xs text-stone-300 gap-2 mb-6">
          <a href="tel:785238090" className="flex items-center gap-1.5 hover:text-amber-400">
            <Phone size={14} className="text-amber-500" />
            <span>Customer Care: <strong className="text-white font-mono">785238090</strong></span>
          </a>
          <a href="mailto:dharohar2026@gmail.com" className="flex items-center gap-1.5 hover:text-amber-400">
            <Mail size={14} className="text-amber-500" />
            <span>Email: <strong className="text-white font-mono">dharohar2026@gmail.com</strong></span>
          </a>
        </div>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Your Full Name</label>
            <input type="text" required placeholder="e.g. Pranshav Rathod" value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Phone / WhatsApp</label>
              <input type="tel" required placeholder="+91 98250 12345" value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Email Address</label>
              <input type="email" placeholder="name@example.com" value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Preferred Watch Model Baseline</label>
            <select value={contactForm.watchModel} onChange={(e) => setContactForm({ ...contactForm, watchModel: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
              {productList.map((p) => (<option key={p.id} value={p.name}>{p.name} ({p.region})</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Describe Your Customization Ideas</label>
            <textarea rows={3} required placeholder="Tell us what dial colors, bezel finishes, straps, or back case engravings you would like..."
              value={contactForm.customNotes} onChange={(e) => setContactForm({ ...contactForm, customNotes: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Preferred Contact Channel</label>
            <div className="flex gap-4">
              {['WhatsApp', 'Direct Phone Call', 'Email'].map(ch => (
                <label key={ch} className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input type="radio" name="preferredContact" value={ch} checked={contactForm.preferredContact === ch}
                    onChange={(e) => setContactForm({ ...contactForm, preferredContact: e.target.value })} className="accent-amber-500" />
                  <span>{ch}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 shadow-lg mt-4">
            <Send size={16} /> Submit Customization Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};
