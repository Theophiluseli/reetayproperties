import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Key, UserCheck, Briefcase, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { dataService } from '../../lib/supabase';
import { User } from '../../types';
import { ReetayLogo } from '../../components/common/ReetayLogo';

interface AdminLoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@reetay.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await dataService.staffLogin(loginEmail, loginPass);
      onLoginSuccess(user);

      // Route according to the staff account role
      if (user.role === 'receptionist') {
        navigate('/reception');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleQuickSelect = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-navy-950 via-navy-900 to-[#0F172A]">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <ReetayLogo size="lg" className="mb-2" />
          <h1 className="text-2xl font-black text-navy-950">Staff Portal</h1>
          <p className="text-xs text-gray-400 font-medium">
            Reetay Apartments rental Management system
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Staff / Admin Email</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-navy-950 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@reetay.com"
                className="bg-transparent text-sm font-semibold text-navy-950 outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Password</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-navy-950 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent text-sm font-semibold text-navy-950 outline-none w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Log in'}
          </button>
        </form>

        {/* Quick Demo Access Roles */}
        <div className="border-t border-gray-100 pt-4 space-y-2.5 text-center">
          <p className="text-xs text-gray-400 font-medium">Quick Demo Accounts:</p>
          
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => handleQuickSelect('admin@reetay.com', 'admin123')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                email === 'admin@reetay.com'
                  ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('manager@reetay.com', 'staff123')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                email === 'manager@reetay.com'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>Manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('reception@reetay.com', 'staff123')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                email === 'reception@reetay.com'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Reception</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleLogin(email, password)}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gold-50 border border-gold-300 text-navy-950 font-bold text-xs hover:bg-gold-100 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-gold-600" />
            <span>Instant One-Click Staff Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};
