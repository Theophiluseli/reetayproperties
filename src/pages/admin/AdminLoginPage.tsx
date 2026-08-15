import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Key } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await dataService.adminLogin(email, password);
      onLoginSuccess(user);
      navigate('/admin');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantAdmin = async () => {
    setLoading(true);
    const user = await dataService.adminLogin('admin@reetay.com', 'admin123');
    onLoginSuccess(user);
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 bg-gradient-to-b from-navy-950 via-navy-900 to-[#0F172A]">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <ReetayLogo size="lg" className="mb-2" />
          <h1 className="text-2xl font-black text-navy-950">Platform Admin Portal</h1>
          <p className="text-xs text-gray-400 font-medium">
            Reetay Apartments Management & Vendor Control Desk
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Admin Email</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-600" />
              <input
                type="email"
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
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* Quick Instant Admin Login */}
        <div className="border-t border-gray-100 pt-4 text-center space-y-2">
          <p className="text-xs text-gray-400">Default Credentials:</p>
          <div className="bg-gray-50 p-2 rounded-xl text-xs font-mono text-navy-950">
            Email: <span className="font-bold">admin@reetay.com</span> | Pass: <span className="font-bold">admin123</span>
          </div>
          <button
            type="button"
            onClick={handleInstantAdmin}
            className="w-full py-2.5 rounded-xl bg-gold-50 border border-gold-300 text-navy-950 font-bold text-xs hover:bg-gold-100 flex items-center justify-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-gold-600" />
            <span>Instant One-Click Admin Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};
