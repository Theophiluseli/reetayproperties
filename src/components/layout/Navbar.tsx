import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bed,
  Car,
  Sparkles,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  UserCheck,
  Briefcase,
  ShieldCheck,
  ClipboardList,
  Clock,
  Menu,
  X,
  LogIn,
  UserPlus,
  Shield
} from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/reception');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
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
      {/* Full-Width Responsive Floating Pill Header (Image 2 Style with White Theme) */}
      <header className="sticky top-2 sm:top-4 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all">
        <div className="relative w-full bg-white/95 backdrop-blur-md rounded-full border border-purple-100/90 shadow-lg hover:shadow-xl transition-all px-6 sm:px-8 lg:px-10 py-2.5 flex items-center justify-between h-20">
          
          {/* Left: Reetay Official Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="group flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <ReetayLogo size="md" />
            </Link>
          </div>

          {/* Center Area: Perfectly Centered Public Vertical Selector (Desktop) */}
          {!isDashboardRoute ? (
            <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80 shadow-inner z-10">
              <button
                onClick={() => onVerticalChange && onVerticalChange('stays')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                  activeVertical === 'stays'
                    ? 'bg-[#2E0854] text-white shadow-sm'
                    : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                }`}
              >
                <Bed className={`w-4 h-4 ${activeVertical === 'stays' ? 'text-white' : 'text-purple-400'}`} />
                <span>Stays</span>
              </button>

              <button
                onClick={() => onVerticalChange && onVerticalChange('cars')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                  activeVertical === 'cars'
                    ? 'bg-[#2E0854] text-white shadow-sm'
                    : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                }`}
              >
                <Car className={`w-4 h-4 ${activeVertical === 'cars' ? 'text-white' : 'text-purple-400'}`} />
                <span>Cars</span>
              </button>

              <button
                onClick={() => onVerticalChange && onVerticalChange('experiences')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                  activeVertical === 'experiences'
                    ? 'bg-[#2E0854] text-white shadow-sm'
                    : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${activeVertical === 'experiences' ? 'text-white' : 'text-purple-400'}`} />
                <span>Experiences</span>
              </button>
            </nav>
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center z-10">
              {location.pathname.startsWith('/admin') && (
                <span className="px-4 py-2 rounded-full bg-[#2E0854] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-purple-800">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Executive Admin Console</span>
                </span>
              )}

              {location.pathname.startsWith('/manager') && (
                <span className="px-4 py-2 rounded-full bg-amber-950 text-amber-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-amber-800">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Manager Console</span>
                </span>
              )}

              {location.pathname.startsWith('/dashboard') && (
                <span className="px-4 py-2 rounded-full bg-purple-100 text-[#2E0854] text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-purple-200">
                  <LayoutDashboard className="w-4 h-4 text-purple-700" />
                  <span>Guest Control Center</span>
                </span>
              )}
            </div>
          )}

          {/* Right Controls: Desktop Auth Buttons + User Account + 3-Line Hamburger Menu */}
          <div className="flex items-center gap-3 ml-auto z-20">
            
            {/* Desktop & Tablet Auth Buttons */}
            {(!currentUser || currentUser.role === 'guest') && (
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-[#2E0854] bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/90 hover:border-purple-300 hover:shadow-sm active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  <span>Log in</span>
                </button>

                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#2E0854] via-purple-900 to-[#2E0854] hover:brightness-110 shadow-md hover:shadow-lg hover:scale-102 active:scale-95 transition-all flex items-center gap-2 border border-purple-800/40 whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Sign up</span>
                </button>
              </div>
            )}

            {/* Staff / Logged In User Dropdown */}
            {currentUser && currentUser.role !== 'guest' ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-purple-200 hover:border-purple-600 transition-all bg-white"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2E0854] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    {getInitials(currentUser.full_name)}
                  </div>
                  <span className="text-xs font-extrabold text-[#2E0854] max-w-[110px] truncate hidden sm:inline">
                    {currentUser.full_name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/40 rounded-t-2xl">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Logged In As</p>
                      <p className="text-xs font-bold text-navy-950 truncate">{currentUser.full_name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                    </div>

                    {currentUser.role === 'receptionist' && (
                      <div className="py-1">
                        <Link
                          to="/reception"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Reception Desk</span>
                        </Link>
                      </div>
                    )}

                    {currentUser.role === 'admin' && (
                      <div className="py-1">
                        <Link
                          to="/admin?tab=bookings"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2E0854] hover:bg-purple-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-700" />
                          <span>Executive Admin Console</span>
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Hamburger Icon Button (Mobile Only: md:hidden) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 sm:p-2.5 rounded-full text-[#2E0854] hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center border border-purple-100/80 bg-purple-50/30"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E0854]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E0854]" />
              )}
            </button>

          </div>
        </div>

        {/* Full-Width Slide-Down Drawer anchored under the Pill Header */}
        {isMobileMenuOpen && (
          <div className="w-full mt-2 sm:mt-3 bg-white/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-purple-100 shadow-2xl p-4 sm:p-5 animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-4">
              
              {/* Vertical Category Switcher (Stays, Cars, Experiences) */}
              {!isDashboardRoute && (
                <div className="bg-purple-50/80 p-1.5 rounded-2xl border border-purple-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => {
                      onVerticalChange && onVerticalChange('stays');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      activeVertical === 'stays'
                        ? 'bg-[#2E0854] text-white shadow-md'
                        : 'text-purple-900 hover:bg-white/60'
                    }`}
                  >
                    <Bed className="w-4 h-4" />
                    <span>Stays</span>
                  </button>

                  <button
                    onClick={() => {
                      onVerticalChange && onVerticalChange('cars');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      activeVertical === 'cars'
                        ? 'bg-[#2E0854] text-white shadow-md'
                        : 'text-purple-900 hover:bg-white/60'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Cars</span>
                  </button>

                  <button
                    onClick={() => {
                      onVerticalChange && onVerticalChange('experiences');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      activeVertical === 'experiences'
                        ? 'bg-[#2E0854] text-white shadow-md'
                        : 'text-purple-900 hover:bg-white/60'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Experiences</span>
                  </button>
                </div>
              )}

              {/* Log In & Sign Up Action Cards */}
              {(!currentUser || currentUser.role === 'guest') ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="flex items-center justify-center gap-3 p-3.5 rounded-2xl border-2 border-purple-200 bg-white hover:bg-purple-50 text-[#2E0854] font-black text-sm transition-all shadow-sm group"
                  >
                    <LogIn className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span>Log In to Account</span>
                  </button>

                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-[#2E0854] hover:bg-purple-900 text-white font-black text-sm transition-all shadow-md active:scale-98 group"
                  >
                    <UserPlus className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span>Create New Account</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2E0854] text-white font-black text-sm flex items-center justify-center">
                      {getInitials(currentUser.full_name)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#2E0854]">{currentUser.full_name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{currentUser.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-[#2E0854] text-white font-black text-xs hover:bg-purple-900 transition-all flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              )}

              {/* Portal & Support Links */}
              <div className="border-t border-purple-100 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-600">
                <Link
                  to="/staff/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-purple-900 hover:text-[#2E0854] transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Staff & Executive Portal</span>
                </Link>

                <Link
                  to="/dashboard/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-[#2E0854] transition-colors"
                >
                  24/7 Concierge Support
                </Link>
              </div>

            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          onLoginSuccess(user);
          setShowAuthModal(false);
        }}
      />
    </>
  );
};
