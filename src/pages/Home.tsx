import React from 'react';
import { ZoomIn, MessageSquare, ShoppingBag } from 'lucide-react';
import type { Product, User, ViewAngle } from '../types';

interface HomePageProps {
  filteredProducts: Product[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  paginatedProducts: Product[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  showcaseAngle: ViewAngle;
  setShowcaseAngle: (a: ViewAngle) => void;
  productList: Product[];
  handleAddToCart: (p: Product) => void;
  handleOpenContactModal: (p?: Product) => void;
  setZoomedImage: (p: Product) => void;
  user: User | null;
  setIsAuthModalOpen: (v: boolean) => void;
  handleLogout: () => void;
  setIsOrdersModalOpen: (v: boolean) => void;
  sortOrder: 'featured' | 'price-asc' | 'price-desc';
  setSortOrder: (s: 'featured' | 'price-asc' | 'price-desc') => void;
}

const categories = ['All Watches', "Women's Collection", 'Forts & Palaces', 'Temples', 'Ancient Architecture', 'Astronomical'];

export const HomePage: React.FC<HomePageProps> = ({
  filteredProducts, activeCategory, setActiveCategory, paginatedProducts,
  totalPages, currentPage, setCurrentPage, productList,
  handleAddToCart, handleOpenContactModal, setZoomedImage, user,
  handleLogout, setIsOrdersModalOpen, sortOrder, setSortOrder
}) => {
  return (
    <main className="pt-[125px] sm:pt-[140px] md:pt-[150px] pb-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/25 to-stone-950/95 pointer-events-none z-[1]" />
        <div className="relative z-[2] text-center max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="hidden xs:block h-px w-6 sm:w-16 bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-amber-400 tracking-[0.2em] sm:tracking-[0.35em] text-[10px] sm:text-[11px] font-bold uppercase font-mono">
              Complete Collection ({filteredProducts.length} Masterpieces)
            </span>
            <div className="hidden xs:block h-px w-6 sm:w-16 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight sm:leading-[1.05]">
            Wear the <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Monuments of Time</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Discover our complete range of heritage timepieces inspired by India's magnificent monuments. Direct, fully insured home delivery to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 sm:px-10 py-3.5 sm:py-4 rounded-none uppercase tracking-[0.15em] sm:tracking-[0.25em] text-xs inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(217,119,6,0.4)]">
              Explore Watches
            </button>
            <button onClick={() => handleOpenContactModal()}
              className="w-full sm:w-auto bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-600/50 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-none uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs inline-flex items-center justify-center gap-2.5 transition-all duration-300">
              <MessageSquare size={15} /> Contact Us to Customize
            </button>
          </div>
        </div>
      </section>

      {/* Flagship Showcase */}
      {productList.length > 0 && (
        <section className="relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-950/5 to-stone-950 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28">
            <div className="flex items-center gap-2 sm:gap-4 mb-12 sm:mb-20">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
              <span className="text-amber-500 tracking-[0.25em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-black uppercase font-mono text-center">✦ Atelier Flagship Masterpiece ✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[460px]">
                <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-3xl bg-amber-500/8 blur-[60px]" />
                <div className="relative group cursor-pointer" onClick={() => setZoomedImage(productList[0])}>
                  <div className="relative w-[260px] h-[260px] xs:w-[300px] xs:h-[300px] sm:w-[380px] sm:h-[380px] rounded-3xl overflow-hidden border-2 border-amber-600/25 shadow-[0_0_80px_rgba(217,119,6,0.18)] group-hover:shadow-[0_0_120px_rgba(217,119,6,0.3)] transition-all duration-700">
                    <img src={productList[0]?.image} alt={productList[0]?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%231c1917'/%3E%3C/svg%3E"; }} />
                    <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-all duration-300 flex items-end justify-center pb-6">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-950/80 backdrop-blur-sm border border-amber-500/40 px-4 py-2 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ZoomIn size={12} /> View Full Detail
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-stone-950 border border-amber-500/40 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.2)] whitespace-nowrap">
                    <span className="text-amber-400 font-serif font-bold text-lg sm:text-xl">{productList[0]?.priceStr}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-amber-400/80 text-[10px] font-mono uppercase tracking-[0.35em]">{productList[0]?.region}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 sm:mb-5">{productList[0]?.name}</h2>
                <div className="h-px w-14 bg-gradient-to-r from-amber-500 to-transparent mb-5 mx-auto lg:mx-0" />
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">{productList[0]?.description}</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-5 border-y border-stone-800 mb-6 sm:mb-8">
                  {[{label:'Crafting Time',value:'120+ Hours'},{label:'Warranty',value:'2 Years'},{label:'Delivery',value:'Free Insured'}].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-white font-bold text-xs sm:text-sm">{s.value}</div>
                      <div className="text-stone-500 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                  {['Handcrafted','Sapphire Crystal','Brass Case','Heritage Dial','Limited Edition'].map(tag => (
                    <span key={tag} className="bg-stone-900 border border-stone-800 text-stone-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => handleAddToCart(productList[0])}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 py-3.5 sm:py-4 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
                    <ShoppingBag size={15} /> Add to Cart
                  </button>
                  <button onClick={() => handleOpenContactModal(productList[0])}
                    className="flex-1 bg-transparent hover:bg-stone-900 text-stone-300 border border-stone-700 hover:border-amber-600/50 py-3.5 sm:py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2">
                    <MessageSquare size={15} /> Bespoke Commission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Women's Highlight Showcase */}
      {productList.filter(p => p.category === "Women's Collection").length >= 5 && (
        <section className="relative z-10 py-16 sm:py-24 bg-stone-950">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-900/5 to-stone-950 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-amber-400 tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold uppercase font-mono">The Women's Collection</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-2 sm:mt-3">Elegance & Heritage</h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4 sm:mt-6" />
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Hero Women's Watch */}
              <div className="lg:col-span-5 relative group cursor-pointer h-full flex flex-col" onClick={() => setZoomedImage(productList.find(p => p.id === 27)!)}>
                <div className="relative flex-1 rounded-2xl overflow-hidden border border-amber-600/20 bg-stone-900/50 flex flex-col">
                  <div className="flex-1 bg-stone-900 p-6 sm:p-8 flex items-center justify-center min-h-[260px]">
                    <img src={productList.find(p => p.id === 27)?.image} alt="Meenakshi Kalyanam (Special Edition)" className="w-full max-h-[280px] sm:max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%231c1917'/%3E%3C/svg%3E"; }} />
                  </div>
                  <div className="bg-stone-950 p-5 sm:p-8 border-t border-amber-600/20">
                    <span className="text-amber-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-1.5 block">Featured Masterpiece</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold mb-2">{productList.find(p => p.id === 27)?.name}</h3>
                    <p className="text-stone-300 text-xs sm:text-sm mb-5 line-clamp-2">{productList.find(p => p.id === 27)?.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-amber-400 font-serif font-bold text-lg sm:text-xl">{productList.find(p => p.id === 27)?.priceStr}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleAddToCart(productList.find(p => p.id === 27)!); }} className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-amber-500/20 whitespace-nowrap">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Supporting Women's Watches */}
              <div className="lg:col-span-7 grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                {[26, 28, 29, 30].map(id => {
                  const p = productList.find(x => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="group relative rounded-xl overflow-hidden border border-stone-800 hover:border-amber-600/30 bg-stone-900/80 cursor-pointer transition-colors flex flex-col" onClick={() => setZoomedImage(p)}>
                      <div className="aspect-square overflow-hidden bg-stone-900 p-4 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl" 
                          onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%231c1917'/%3E%3C/svg%3E"; }}/>
                      </div>
                      <div className="p-3.5 sm:p-4 bg-stone-900/95 border-t border-stone-800 flex flex-col justify-between flex-1">
                        <h4 className="text-white font-serif text-xs sm:text-sm font-bold truncate mb-2">{p.name}</h4>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-amber-400 text-xs font-bold">{p.priceStr}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }} className="bg-stone-800 p-2 rounded hover:bg-amber-500 hover:text-stone-900 text-stone-300 transition-colors">
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Collection Grid */}
      <section id="collections" className="relative z-10 py-16 sm:py-24 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-amber-400 tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold uppercase font-mono">Heritage Collection</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-2 sm:mt-3">All Timepieces</h2>
          </div>
          {/* Category Filters & Sorting */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-center mb-8 sm:mb-12">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start w-full md:w-auto">
              {categories.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === cat ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:border-amber-600/50 hover:text-white'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
              <span className="text-stone-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg outline-none appearance-none pr-7 sm:pr-8 cursor-pointer hover:border-amber-600/50 transition-colors"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a8a29e%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="group bg-stone-900/80 backdrop-blur-sm border border-stone-800 hover:border-amber-600/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)] flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-900 cursor-pointer" onClick={() => setZoomedImage(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23292524'/%3E%3Ctext x='100' y='100' font-family='serif' font-size='14' text-anchor='middle' fill='%23a8a29e' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }} />
                    <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-amber-500/90 text-stone-950 rounded-full p-2.5 sm:p-3 transform scale-75 group-hover:scale-100 transition-transform"><ZoomIn size={20} /></div>
                    </div>
                    <div className="absolute top-2.5 left-2.5 bg-stone-950/90 backdrop-blur px-2 py-0.5 rounded-full text-amber-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 max-w-[85%] truncate">{product.category}</div>
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <p className="text-stone-500 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-1 truncate">{product.region}</p>
                    <h3 className="text-white font-serif font-bold text-xs sm:text-sm leading-tight mb-3 line-clamp-2 h-9">{product.name}</h3>
                  </div>
                </div>
                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800">
                    <span className="text-amber-400 font-bold text-xs sm:text-sm font-serif">{product.priceStr}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleAddToCart(product)} className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-colors whitespace-nowrap">
                        <ShoppingBag size={13} /> Add
                      </button>
                      <button onClick={() => handleOpenContactModal(product)} className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/30 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors" title="Customize">
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 sm:mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold transition-all ${currentPage === page ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-white'}`}>{page}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Account Section */}
      {user && (
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-2xl mx-auto bg-stone-900/80 border border-amber-600/30 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Welcome, {user.name}</h3>
            <p className="text-stone-400 text-xs sm:text-sm mb-6">{user.email}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => setIsOrdersModalOpen(true)} className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs uppercase tracking-wider">My Orders</button>
              <button onClick={() => handleLogout()} className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs uppercase tracking-wider">Sign Out</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
