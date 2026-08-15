import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Briefcase, Key, Mail, Lock } from 'lucide-react';
import { dataService } from '../../lib/supabase';
import { User } from '../../types';
import { ReetayLogo } from '../../components/common/ReetayLogo';

interface StaffLoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [roleMode, setRoleMode] = useState<'receptionist' | 'manager' | 'admin'>('receptionist');
  const [email, setEmail] = useState('reception@reetay.com');
  const [password, setPassword] = useState('staff123');
  const [loading, setLoading] = useState(false);

  const handleRoleTabChange = (role: 'receptionist' | 'manager' | 'admin') => {
    setRoleMode(role);
    if (role === 'receptionist') setEmail('reception@reetay.com');
    else if (role === 'manager') setEmail('manager@reetay.com');
    else setEmail('admin@reetay.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user: User;
      if (roleMode === 'receptionist') {
        user = await dataService.receptionistLogin(email, password);
        onLoginSuccess(user);
        navigate('/reception');
      } else if (roleMode === 'manager') {
        user = await dataService.managerLogin(email, password);
        onLoginSuccess(user);
        navigate('/manager');
      } else {
        user = await dataService.adminLogin(email, password);
        onLoginSuccess(user);
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setLoading(true);
    let user: User;
    if (roleMode === 'receptionist') {
      user = await dataService.receptionistLogin('reception@reetay.com', 'staff123');
      onLoginSuccess(user);
      navigate('/reception');
    } else if (roleMode === 'manager') {
      user = await dataService.managerLogin('manager@reetay.com', 'staff123');
      onLoginSuccess(user);
      navigate('/manager');
    } else {
      user = await dataService.adminLogin('admin@reetay.com', 'admin123');
      onLoginSuccess(user);
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 bg-gradient-to-b from-navy-950 via-navy-900 to-[#0F172A]">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <ReetayLogo size="lg" className="mb-2" />
          <h1 className="text-2xl font-black text-navy-950">Staff & Operations Portal</h1>
          <p className="text-xs text-gray-400 font-medium">
            Sign in as Receptionist, Manager, or Admin
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => handleRoleTabChange('receptionist')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              roleMode === 'receptionist' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Receptionist</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('manager')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              roleMode === 'manager' ? 'bg-gold-500 text-navy-950 shadow-md' : 'text-gray-500'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              roleMode === 'admin' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
              {roleMode.toUpperCase()} EMAIL
            </label>
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
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">PASSWORD</label>
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
            {loading ? 'Authenticating...' : `Sign In to ${roleMode.toUpperCase()} Dashboard`}
          </button>
        </form>

        {/* Demo Quick Button */}
        <div className="border-t border-gray-100 pt-4 text-center space-y-2">
          <p className="text-xs text-gray-400">Instant Demo Preset:</p>
          <button
            type="button"
            onClick={handleInstantDemo}
            className="w-full py-2.5 rounded-xl bg-gold-50 border border-gold-300 text-navy-950 font-bold text-xs hover:bg-gold-100 flex items-center justify-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-gold-600" />
            <span>Instant 1-Click Login as {roleMode.toUpperCase()}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
