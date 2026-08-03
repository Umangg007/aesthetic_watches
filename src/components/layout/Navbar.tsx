import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, ShoppingBag, X, Menu, User, Phone, Mail, Search, LogOut, Shield } from 'lucide-react';
import type { User as UserType, Product } from '../../types';

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
  handleMakeAdmin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  logoError, setLogoError,
  isMenuOpen, setIsMenuOpen, cartItemCount, user,
  setIsCartOpen, setIsAuthModalOpen, handleOpenContactModal, productList,
  searchQuery, setSearchQuery, handleLogout, handleMakeAdmin
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-40 top-0 bg-stone-950/95 backdrop-blur-md border-b border-white/5">
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-amber-600/20 text-amber-300/80 py-1.5 px-4 text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="tel:785238090" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-mono">
              <Phone size={11} /> Customer Care: <strong className="text-amber-300">785238090</strong>
            </a>
            <span className="text-amber-800 hidden sm:block">|</span>
            <a href="mailto:dharohar2026@gmail.com" className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors font-mono">
              <Mail size={11} /> dharohar2026@gmail.com
            </a>
          </div>
          <span className="hidden md:block tracking-[0.2em] uppercase text-[10px] font-bold text-amber-600">
            ✦ Complimentary Insured Express Delivery Across India ✦
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 flex items-center gap-3"
          >
            {!logoError ? (
              <img
                src="1000114461.png"
                alt="Dharohar"
                className="h-12 w-auto object-contain rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-xl font-serif font-bold text-amber-400 tracking-widest uppercase">Dharohar</span>
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

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              onClick={(e) => {
                if (isActive('/')) {
                  e.preventDefault();
                  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-lg ${isActive('/') ? 'text-amber-400' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              Collection ({productList.length})
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-lg ${isActive('/about') ? 'text-amber-400' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              Our Story (About)
            </Link>
            <button
              onClick={() => handleOpenContactModal()}
              className="ml-2 flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 px-4 py-2 rounded-lg text-xs tracking-wider font-bold uppercase transition-all"
            >
              <MessageSquare size={13} /> Customize
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
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
                {user.role !== 'admin' && (
                  <button onClick={handleMakeAdmin} className="text-stone-500 hover:text-amber-500 transition-colors" title="Make me Admin (Demo)">
                    <Shield size={15} />
                  </button>
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
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-stone-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center border border-stone-950">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-stone-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search timepieces..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/') navigate('/');
              }}
              className="w-full bg-stone-900/80 border border-stone-800 focus:border-amber-500 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-stone-500 transition-all outline-none"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-md border-b border-white/5 absolute w-full max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={(e) => {
                setIsMenuOpen(false);
                if (isActive('/')) {
                  e.preventDefault();
                  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`block px-4 py-3 text-xs tracking-widest uppercase font-bold transition-colors rounded-lg ${isActive('/') ? 'bg-white/5 text-amber-400' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
            >
              Collection ({productList.length})
            </Link>
            <Link
              to="/about"
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`block px-4 py-3 text-xs tracking-widest uppercase font-bold transition-colors rounded-lg ${isActive('/about') ? 'bg-white/5 text-amber-400' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
            >
              Our Story (About)
            </Link>
            <button
              onClick={() => { setIsMenuOpen(false); handleOpenContactModal(); }}
              className="w-full flex items-center justify-center gap-2 bg-amber-600/20 text-amber-400 border border-amber-600/30 px-4 py-3 rounded-lg text-xs tracking-widest font-bold uppercase"
            >
              <MessageSquare size={14} /> Custom Orders
            </button>
            {!user ? (
              <button
                onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 px-4 py-3 rounded-lg text-xs tracking-widest font-bold uppercase mt-4"
              >
                <User size={14} /> Sign In / Register
              </button>
            ) : (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-900/30 border border-amber-800 text-amber-400 px-4 py-3 rounded-lg text-xs tracking-widest font-bold uppercase mt-4 transition-colors"
                  >
                    <Shield size={14} /> Admin Dashboard
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <button
                    onClick={() => { setIsMenuOpen(false); handleMakeAdmin(); }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 px-4 py-3 rounded-lg text-xs tracking-widest font-bold uppercase mt-2 transition-colors"
                  >
                    <Shield size={14} /> Make Me Admin
                  </button>
                )}
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 hover:text-red-400 px-4 py-3 rounded-lg text-xs tracking-widest font-bold uppercase mt-2 transition-colors"
                >
                  <LogOut size={14} /> Sign Out ({user.name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
