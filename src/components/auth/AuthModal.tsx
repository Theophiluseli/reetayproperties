import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { dataService } from '../../lib/supabase';
import { User } from '../../types';
import { ReetayLogo } from '../common/ReetayLogo';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-purple-100 relative overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-900 hover:bg-purple-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header with Reetay Official Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-3">
            <ReetayLogo size="md" />
          </div>
          <h2 className="text-2xl font-black text-[#2E0854]">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-purple-950/70 font-semibold">
            Reetay Properties
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-purple-50/70 p-1.5 rounded-2xl mb-6 border border-purple-100">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'login' ? 'bg-[#2E0854] text-white shadow-md' : 'text-purple-900 hover:text-[#2E0854]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'signup' ? 'bg-[#2E0854] text-white shadow-md' : 'text-purple-900 hover:text-[#2E0854]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] uppercase font-black text-[#2E0854] block mb-1 tracking-wider">Full Name</label>
              <div className="bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-purple-600 focus-within:bg-white transition-all">
                <UserIcon className="w-4 h-4 text-purple-700" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent text-sm font-extrabold text-[#2E0854] placeholder:text-gray-400 outline-none w-full"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-black text-[#2E0854] block mb-1 tracking-wider">Email Address</label>
            <div className="bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-purple-600 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-purple-700" />
              <input
                type="email"
                placeholder="name@reetay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm font-extrabold text-[#2E0854] placeholder:text-gray-400 outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black text-[#2E0854] block mb-1 tracking-wider">Password</label>
            <div className="bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-purple-600 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-purple-700" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-sm font-extrabold text-[#2E0854] placeholder:text-gray-400 outline-none w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2E0854] hover:bg-black text-white font-black text-sm shadow-md active:scale-95 transition-all mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In to Account' : 'Create Free Account'}
          </button>
        </form>

      </div>
    </div>
  );
};

