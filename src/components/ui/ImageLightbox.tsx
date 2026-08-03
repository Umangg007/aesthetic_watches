import React from 'react';
import { ShoppingBag, MessageSquare, X } from 'lucide-react';
import type { Product } from '../../types';

interface ImageLightboxProps {
  zoomedImage: Product | null;
  setZoomedImage: (p: Product | null) => void;
  handleAddToCart: (p: Product) => void;
  handleOpenContactModal: (p: Product) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  zoomedImage,
  setZoomedImage,
  handleAddToCart,
  handleOpenContactModal
}) => {
  if (!zoomedImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/97 backdrop-blur-lg flex items-center justify-center p-4 lg:p-12" onClick={() => setZoomedImage(null)}>
      <button onClick={() => setZoomedImage(null)} className="absolute top-5 right-5 text-stone-400 hover:text-white bg-stone-900/90 rounded-full p-2.5 transition-colors border border-stone-700 hover:border-amber-500 z-[60]">
        <X size={24} />
      </button>
      <div className="relative w-full max-w-2xl flex flex-col items-center gap-5" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <span className="text-amber-500/70 text-[10px] font-mono uppercase tracking-[0.4em] block mb-1">{zoomedImage.region}</span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">{zoomedImage.name}</h3>
        </div>
        {/* Rounded square image frame */}
        <div className="relative w-full aspect-square bg-stone-900 border border-stone-800 overflow-hidden shadow-[0_0_80px_rgba(217,119,6,0.15)] rounded-3xl">
          <img
            src={zoomedImage.image}
            alt={zoomedImage.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='480'%3E%3Crect width='480' height='480' fill='%231c1917'/%3E%3C/svg%3E"; }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/90 to-transparent px-5 py-5 flex items-end justify-between">
            <span className="text-amber-400 font-serif font-bold text-2xl">{zoomedImage.priceStr}</span>
            <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold border border-stone-700 px-2 py-1">{zoomedImage.category}</span>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button onClick={() => { handleAddToCart(zoomedImage); setZoomedImage(null); }}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 py-4 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_25px_rgba(217,119,6,0.3)] hover:shadow-[0_0_40px_rgba(217,119,6,0.5)] flex items-center justify-center gap-2">
            <ShoppingBag size={15} /> Add to Cart
          </button>
          <button onClick={() => { setZoomedImage(null); handleOpenContactModal(zoomedImage); }}
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 hover:border-amber-600/40 py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2">
            <MessageSquare size={15} /> Customize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
