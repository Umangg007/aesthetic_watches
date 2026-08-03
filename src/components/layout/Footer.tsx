import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import type { Product } from '../../types';

interface FooterProps {
  logoError: boolean;
  productList: Product[];
  handleOpenContactModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ logoError, productList, handleOpenContactModal }) => (
  <footer className="relative z-10 bg-stone-950/95 backdrop-blur-xl border-t border-amber-600/40 shadow-[0_-15px_40px_rgba(0,0,0,0.9)] pt-16 pb-12 text-stone-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          {!logoError ? (
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="1000114461.png"
                alt="Dharohar"
                className="h-28 w-auto mb-6 object-contain rounded-xl shadow-[0_0_30px_rgba(217,119,6,0.35)] border border-amber-500/40 cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ) : (
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <h2 className="text-2xl font-serif font-bold text-amber-400 tracking-widest uppercase mb-6 cursor-pointer">
                Dharohar
              </h2>
            </Link>
          )}
          <p className="text-stone-200 text-sm leading-relaxed font-medium">
            Preserving the architectural legacy of India, one handcrafted luxury timepiece at a time.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-amber-400 font-serif text-lg font-bold mb-6 border-b border-amber-500/20 pb-2">Explore Atelier</h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                onClick={() => setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                className="text-stone-300 hover:text-amber-300 transition-colors text-sm font-medium block"
              >
                Heritage Watch Collection ({productList.length})
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-stone-300 hover:text-amber-300 transition-colors text-sm font-medium block"
              >
                Our Story &amp; Craftsmanship
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleOpenContactModal()}
                className="text-amber-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-1.5"
              >
                <MessageSquare size={14} /> Contact Us to Customize
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-amber-400 font-serif text-lg font-bold mb-6 border-b border-amber-500/20 pb-2">Support &amp; Customer Care</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-stone-200 text-sm">
              <span className="text-amber-500">📞</span>
              <a href="tel:785238090" className="hover:text-amber-300">785238090</a>
            </li>
            <li className="flex items-center gap-3 text-stone-200 text-sm">
              <span className="text-amber-500">✉️</span>
              <a href="mailto:dharohar2026@gmail.com" className="hover:text-amber-300">dharohar2026@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Guarantee */}
        <div>
          <h4 className="text-amber-400 font-serif text-lg font-bold mb-6 border-b border-amber-500/20 pb-2">Heritage Guarantee</h4>
          <ul className="space-y-3 text-sm text-stone-300">
            <li>✓ 2-Year Master Artisan Warranty</li>
            <li>✓ Free Insured Home Delivery</li>
            <li>✓ Authenticity Certificate</li>
            <li>✓ 30-Day Return Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <p className="text-amber-300/80 font-mono font-medium text-center md:text-left uppercase tracking-widest text-[10px] sm:text-xs">
          &copy; 2026 Dharohar - Heritage Timepieces. All Rights Reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-stone-400 font-medium text-[11px] sm:text-xs">
          <span className="hover:text-amber-400 cursor-pointer">Insured Delivery</span>
          <span className="hover:text-amber-400 cursor-pointer">Warranty &amp; Care</span>
          <span className="hover:text-amber-400 cursor-pointer">Privacy Policy</span>
          <Link
            to="/admin"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-amber-400 cursor-pointer text-stone-600 flex items-center gap-1"
          >
            🔒 Admin
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
