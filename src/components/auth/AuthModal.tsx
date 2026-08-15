import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { dataService } from '../../lib/supabase';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await dataService.login(email);
      if (fullName) user.full_name = fullName;
      onSuccess(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    const user = await dataService.login('david@reetay.com');
    onSuccess(user);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 via-amber-500 to-yellow-400 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
            <span className="text-white font-black text-2xl">R</span>
          </div>
          <h2 className="text-2xl font-black text-navy-950">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Access your luxury stays, bookings, and VIP concierge desk
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500 hover:text-navy-950'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500 hover:text-navy-950'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Name</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gold-600" />
                <input
                  type="text"
                  placeholder="David Reetay"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-navy-950 outline-none w-full"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Email Address</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-600" />
              <input
                type="email"
                placeholder="david@reetay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm font-semibold text-navy-950 outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Password</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold-600" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-sm font-semibold text-navy-950 outline-none w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In to Account' : 'Create Free Account'}
          </button>
        </form>

        {/* Demo Quick Log-in */}
        <div className="mt-4 border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Or continue with quick demo profile:</p>
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-2.5 rounded-xl bg-gold-50 border border-gold-300 text-navy-950 font-bold text-xs hover:bg-gold-100 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Instant Demo Guest Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};
