import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bed, Car, Sparkles, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { VerticalType, User } from '../../types';
import { AuthModal } from '../auth/AuthModal';
import { ReetayLogo } from '../common/ReetayLogo';

interface NavbarProps {
  activeVertical?: VerticalType;
  onVerticalChange?: (vertical: VerticalType) => void;
  currentUser: User | null;
  onLogout: () => void;
  onLoginSuccess: (user: User) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeVertical = 'stays',
  onVerticalChange,
  currentUser,
  onLogout,
  onLoginSuccess
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            {/* Reetay Official Logo (Left) */}
            <div className="flex items-center">
              <Link to="/" className="group">
                <ReetayLogo size="md" />
              </Link>
            </div>

            {/* Vertical Tabs (Dead-Centered in Viewport Header) */}
            {!isDashboard && (
              <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80 shadow-inner z-10">
                <button
                  onClick={() => onVerticalChange && onVerticalChange('stays')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeVertical === 'stays'
                      ? 'bg-[#2E0854] text-white shadow-md'
                      : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                  }`}
                >
                  <Bed className={`w-4 h-4 ${activeVertical === 'stays' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Stays</span>
                </button>
                <button
                  onClick={() => onVerticalChange && onVerticalChange('cars')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeVertical === 'cars'
                      ? 'bg-[#2E0854] text-white shadow-md'
                      : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                  }`}
                >
                  <Car className={`w-4 h-4 ${activeVertical === 'cars' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Cars</span>
                </button>
                <button
                  onClick={() => onVerticalChange && onVerticalChange('experiences')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeVertical === 'experiences'
                      ? 'bg-[#2E0854] text-white shadow-md'
                      : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${activeVertical === 'experiences' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Experiences</span>
                </button>
              </nav>
            )}

            {/* User Controls (Right) */}
            <div className="flex items-center gap-3 ml-auto">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-purple-200 hover:border-purple-600 hover:shadow-md transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2E0854] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {getInitials(currentUser.full_name)}
                    </div>
                    <span className="text-xs font-extrabold text-[#2E0854] max-w-[120px] truncate hidden sm:inline">
                      {currentUser.full_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-purple-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-navy-950 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gold-600" />
                        <span>User Dashboard</span>
                      </Link>

                      {(currentUser.role === 'receptionist' || currentUser.role === 'admin' || currentUser.role === 'manager') && (
                        <Link
                          to="/reception"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <span>Reception Desk</span>
                        </Link>
                      )}

                      {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
                        <Link
                          to="/manager"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-navy-950 hover:bg-gold-50 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-gold-500" />
                          <span>Manager Console</span>
                        </Link>
                      )}

                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard/bookings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                      >
                        <Bed className="w-4 h-4 text-gold-600" />
                        <span>My Bookings</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/portal/login"
                    className="hidden sm:inline-block px-3 py-2 text-xs font-extrabold text-navy-950 hover:text-gold-600 transition-colors"
                  >
                    Staff Portal
                  </Link>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="px-4 py-2 text-sm font-bold text-navy-950 hover:text-gold-600 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-navy-950 hover:bg-black shadow-md shadow-navy-950/20 active:scale-95 transition-all"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={(user) => {
          onLoginSuccess(user);
          setShowAuthModal(false);
        }}
      />
    </>
  );
};
