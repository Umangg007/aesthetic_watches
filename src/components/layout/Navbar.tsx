import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, ShoppingBag, X, Menu, User, Phone, Mail, Search, LogOut, Shield, Compass, Watch, PhoneCall, Sparkles, ChevronRight } from 'lucide-react';
import type { User as UserType, Product, SiteSettings } from '../../types';

interface NavbarProps {
  logoError: boolean;
  setLogoError: (v: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  cartItemCount: number;
  user: UserType | null;
  setIsCartOpen: (v: boolean) => void;
  setIsAuthModalOpen: (v: boolean) => void;
  handleOpenContactModal: () => void;
  productList: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleLogout: () => void;
  siteSettings?: SiteSettings;
}

const Navbar: React.FC<NavbarProps> = ({
  logoError, setLogoError,
  isMenuOpen, setIsMenuOpen, cartItemCount, user,
  setIsCartOpen, setIsAuthModalOpen, handleOpenContactModal, productList,
  searchQuery, setSearchQuery, handleLogout, siteSettings
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const phone = siteSettings?.phone || '785238090';
  const email = siteSettings?.email || 'dharohar2026@gmail.com';
  const announcement = siteSettings?.announcement || '✦ Insured Express Delivery Across India ✦';

  return (
    <nav className="fixed w-full z-50 top-0 bg-stone-950/95 backdrop-blur-md border-b border-white/5">
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-amber-600/20 text-amber-300/90 py-1.5 px-3 sm:px-4 text-[10px] sm:text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5 overflow-hidden">
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-mono whitespace-nowrap">
              <Phone size={11} className="text-amber-400 shrink-0" />
              <span className="hidden xs:inline text-stone-400">Call:</span>
              <strong className="text-amber-300">{phone}</strong>
            </a>
            <span className="text-amber-800/80 hidden xs:block">|</span>
            <a href={`mailto:${email}`} className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors font-mono truncate">
              <Mail size={11} className="text-amber-400 shrink-0" /> {email}
            </a>
          </div>
          <span className="tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[9px] sm:text-[10px] font-bold text-amber-500 truncate">
            {announcement}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 flex items-center gap-2 sm:gap-3"
          >
            {!logoError ? (
              <img
                src="1000114461.png"
                alt="Dharohar"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain rounded-lg border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-lg sm:text-xl font-serif font-bold text-amber-400 tracking-widest uppercase">Dharohar</span>
            )}
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search timepieces, monuments..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/') navigate('/');
              }}
              className="w-full bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 focus:border-amber-500 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-stone-500 transition-all outline-none"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Center nav links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              onClick={(e) => {
                if (isActive('/')) {
                  e.preventDefault();
                  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 lg:px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-lg ${isActive('/') ? 'text-amber-400' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              Collection ({productList.length})
            </Link>
            <Link
              to="/about"
              className={`px-3 lg:px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-lg ${isActive('/about') ? 'text-amber-400' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              Our Story (About)
            </Link>
            <button
              onClick={() => handleOpenContactModal()}
              className="ml-2 flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 px-3.5 py-2 rounded-lg text-xs tracking-wider font-bold uppercase transition-all"
            >
              <MessageSquare size={13} /> Customize
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-amber-400 font-medium flex items-center gap-2">
                  {user.name} {user.role === 'admin' && <Shield size={12} className="text-amber-500" />}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-stone-400 hover:text-amber-400 transition-colors bg-white/5 p-1.5 rounded" title="Admin Dashboard">
                    <Shield size={14} />
                  </Link>
                )}
                <button onClick={handleLogout} className="text-stone-400 hover:text-white transition-colors" title="Sign Out">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 hover:text-white uppercase tracking-wider transition-colors"
              >
                <User size={15} /> Sign In
              </button>
            )}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 sm:p-2.5 text-stone-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center border border-stone-950">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 sm:p-2.5 text-stone-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X size={22} className="text-amber-400" /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search timepieces, monuments..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/') navigate('/');
              }}
              className="w-full bg-stone-900/90 border border-stone-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder:text-stone-500 transition-all outline-none shadow-inner"
            />
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500">
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Redesigned Mobile Menu Sheet */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-950/98 backdrop-blur-2xl border-b border-amber-500/20 absolute w-full max-h-[85vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 animate-[fade-in-down_0.25s_ease-out]">
          <div className="p-4 space-y-4">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-stone-800/80">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-500/90 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" /> Atelier Menu
              </span>
              <span className="text-[10px] font-mono text-stone-500">
                {productList.length} Masterpieces
              </span>
            </div>

            {/* Main Nav Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (isActive('/')) {
                    e.preventDefault();
                    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent text-amber-400 border-amber-500/40 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
                    : 'bg-stone-900/60 text-stone-200 border-stone-800/80 hover:border-amber-600/40 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-stone-800/80 text-amber-400 border border-stone-700/60">
                    <Watch size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">Timepiece Collection</div>
                    <div className="text-[10px] text-stone-400">Explore handcrafted heritage watches</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {productList.length}
                  </span>
                  <ChevronRight size={14} className="text-stone-500" />
                </div>
              </Link>

              <Link
                to="/about"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isActive('/about')
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent text-amber-400 border-amber-500/40 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
                    : 'bg-stone-900/60 text-stone-200 border-stone-800/80 hover:border-amber-600/40 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-stone-800/80 text-amber-400 border border-stone-700/60">
                    <Compass size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">Our Story (About)</div>
                    <div className="text-[10px] text-stone-400">Indian monuments & horology legacy</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-stone-500" />
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleOpenContactModal();
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-amber-950/30 text-amber-300 border border-amber-600/40 hover:border-amber-500 transition-all text-left shadow-lg shadow-amber-600/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white">Bespoke Custom Orders</div>
                    <div className="text-[10px] text-amber-300/80">Design your personalized monument watch</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-1 rounded-md">
                  Request
                </span>
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="bg-stone-900/70 rounded-xl p-3 border border-stone-800/80 space-y-2">
              <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 px-1">Quick Contact</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-amber-300 hover:text-amber-200 text-xs font-mono truncate"
                >
                  <PhoneCall size={13} className="text-amber-400 shrink-0" />
                  <span className="truncate">{phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-amber-300 hover:text-amber-200 text-xs font-mono truncate"
                >
                  <Mail size={13} className="text-amber-400 shrink-0" />
                  <span className="truncate">Email Us</span>
                </a>
              </div>
            </div>

            {/* Account & Administration Section */}
            <div className="pt-2 border-t border-stone-800/80">
              {user ? (
                <div className="bg-stone-900/40 p-3 rounded-xl border border-stone-800/60 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-stone-400">{user.email}</div>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/20">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 py-2.5 rounded-lg text-xs tracking-widest font-bold uppercase transition-all"
                    >
                      <Shield size={14} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-950 border border-stone-800 text-stone-400 hover:text-red-400 py-2.5 rounded-lg text-xs tracking-widest font-bold uppercase transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 hover:border-amber-500/50 text-stone-200 py-3 rounded-xl text-xs tracking-widest font-bold uppercase transition-all shadow-md"
                >
                  <User size={15} className="text-amber-400" /> Sign In / Register Account
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
