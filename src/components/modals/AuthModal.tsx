import React from 'react';
import { X, User } from 'lucide-react';
import type { AuthFormData, AuthTab } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authTab: AuthTab;
  setAuthTab: (t: AuthTab) => void;
  authFormData: AuthFormData;
  setAuthFormData: (f: AuthFormData) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleDemoLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen, onClose, authTab, setAuthTab,
  authFormData, setAuthFormData, handleLoginSubmit, handleDemoLogin
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-stone-900 rounded-2xl border border-amber-600/30 shadow-[0_0_50px_rgba(217,119,6,0.15)] p-8 overflow-hidden z-10">
        <button onClick={onClose} className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors">
          <X size={22} />
        </button>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mb-3 border border-amber-500/20">
            <User size={24} />
          </div>
          <h3 className="text-2xl font-serif text-white">Collector Authentication</h3>
          <p className="text-stone-400 text-xs mt-1">Sign in to track orders and request custom timepieces</p>
        </div>
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-2 text-center text-xs tracking-widest uppercase font-bold border-b-2 transition-colors ${authTab === 'login' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthTab('signup')}
            className={`flex-1 py-2 text-center text-xs tracking-widest uppercase font-bold border-b-2 transition-colors ${authTab === 'signup' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Create Account
          </button>
        </div>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {authTab === 'signup' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Full Name</label>
              <input type="text" placeholder="Enter your full name" value={authFormData.name}
                onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Email Address</label>
            <input type="email" required placeholder="name@example.com" value={authFormData.email}
              onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          {authTab === 'signup' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Mobile Number</label>
              <input type="tel" placeholder="+91 98765 43210" value={authFormData.phone}
                onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Password</label>
            <input type="password" required placeholder="••••••••" value={authFormData.password}
              onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-lg uppercase tracking-wider text-xs transition-colors shadow-lg mt-2">
            {authTab === 'login' ? 'Sign In to Account' : 'Register Collector Profile'}
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <span className="text-stone-500 text-xs block mb-3">Or continue quickly with</span>
          <button onClick={handleDemoLogin} className="w-full bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-600/30 font-medium py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2">
            <User size={16} /> Quick Demo Login (Pranshav Rathod)
          </button>
        </div>
      </div>
    </div>
  );
};
