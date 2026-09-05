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
  Shield,
  Heart,
  Calendar,
  Settings,
  Users
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
      <header className="sticky top-2 sm:top-4 z-40 w-full px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all">
        <div className="relative w-full bg-white/95 backdrop-blur-md rounded-full border border-purple-100/90 shadow-lg hover:shadow-xl transition-all px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Column: Reetay Official Logo */}
          <div className="flex-shrink-0 md:flex-1 flex items-center justify-start">
            <Link to="/" className="group flex items-center flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <ReetayLogo size="md" />
            </Link>
          </div>

          {/* Center Column: Perfectly Centered Public Vertical Selector (Desktop md+) */}
          {!isDashboardRoute ? (
            <div className="flex-shrink-0 hidden md:flex items-center justify-center">
              <nav className="flex items-center bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80 shadow-inner">
                <button
                  onClick={() => onVerticalChange && onVerticalChange('stays')}
                  className={`flex items-center gap-1.5 lg:gap-2 px-3.5 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all ${
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
                  className={`flex items-center gap-1.5 lg:gap-2 px-3.5 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all ${
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
                  className={`flex items-center gap-1.5 lg:gap-2 px-3.5 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all ${
                    activeVertical === 'experiences'
                      ? 'bg-[#2E0854] text-white shadow-sm'
                      : 'text-purple-900 hover:text-[#2E0854] hover:bg-white/60'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${activeVertical === 'experiences' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Experiences</span>
                </button>
              </nav>
            </div>
          ) : (
            <div className="flex-shrink-0 hidden md:flex items-center justify-center">
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

              {location.pathname.startsWith('/reception') && (
                <span className="px-4 py-2 rounded-full bg-emerald-900 text-emerald-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-emerald-800">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Reception Desk</span>
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

          {/* Right Column: Auth Buttons or User Account + Mobile Menu Toggle */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 lg:gap-3 md:flex-1 ml-auto">
            
            {/* When NOT logged in: Prominent Log in and Sign up buttons */}
            {!currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 flex-shrink-0">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-extrabold text-[#2E0854] bg-purple-50/80 border border-purple-200/80 hover:bg-purple-100 hover:border-purple-300 hover:shadow-sm active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-700 flex-shrink-0 hidden sm:inline" />
                  <span>Log in</span>
                </button>

                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-3 sm:px-4.5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-extrabold text-white bg-gradient-to-r from-[#2E0854] via-purple-900 to-[#2E0854] hover:brightness-110 shadow-sm hover:shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 border border-purple-800/40 whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-300 flex-shrink-0 hidden sm:inline" />
                  <span>Sign up</span>
                </button>
              </div>
            ) : (
              /* When Logged in: User Account Avatar & Menu */
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 sm:pr-3 rounded-full border border-purple-200 hover:border-purple-600 transition-all bg-white shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2E0854] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    {getInitials(currentUser.full_name)}
                  </div>
                  <span className="text-xs font-extrabold text-[#2E0854] max-w-[110px] truncate hidden sm:inline">
                    {currentUser.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-purple-400 hidden sm:inline" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/40 rounded-t-2xl">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Logged In As</p>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#2E0854] uppercase tracking-wider">
                          {currentUser.role}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-navy-950 truncate">{currentUser.full_name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      {/* Guest Navigation Only */}
                      {currentUser.role === 'guest' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2E0854] hover:bg-purple-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-700" />
                            <span>Guest Control Center</span>
                          </Link>
                          <Link
                            to="/dashboard/bookings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>My Bookings</span>
                          </Link>
                          <Link
                            to="/dashboard/favorites"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>Saved Favorites</span>
                          </Link>
                        </>
                      )}

                      {/* Receptionist Desk */}
                      {currentUser.role === 'receptionist' && (
                        <Link
                          to="/reception"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Reception Desk</span>
                        </Link>
                      )}

                      {/* Manager Console */}
                      {currentUser.role === 'manager' && (
                        <>
                          <Link
                            to="/manager"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-amber-600" />
                            <span>Manager Console</span>
                          </Link>
                          <Link
                            to="/reception"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>Front Desk Overview</span>
                          </Link>
                        </>
                      )}

                      {/* Admin Console & Settings */}
                      {currentUser.role === 'admin' && (
                        <>
                          <Link
                            to="/admin?tab=bookings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2E0854] hover:bg-purple-50 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-700" />
                            <span>Executive Admin Console</span>
                          </Link>
                          <Link
                            to="/admin?tab=staff"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2E0854] hover:bg-purple-50 transition-colors"
                          >
                            <Users className="w-4 h-4 text-purple-700" />
                            <span>Staff & Access Control</span>
                          </Link>
                        </>
                      )}
                    </div>

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
            )}

            {/* Hamburger Icon Button (Mobile Only: md:hidden) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 sm:p-2.5 rounded-full text-[#2E0854] hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center border border-purple-100/80 bg-purple-50/30 flex-shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#2E0854]" />
              ) : (
                <Menu className="w-5 h-5 text-[#2E0854]" />
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
              {!currentUser ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="flex items-center justify-center gap-3 p-3.5 rounded-2xl border-2 border-purple-200 bg-white hover:bg-purple-50 text-[#2E0854] font-black text-sm transition-all shadow-sm group cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span>Log In to Account</span>
                  </button>

                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-[#2E0854] hover:bg-purple-900 text-white font-black text-sm transition-all shadow-md active:scale-98 group cursor-pointer"
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

                  <div className="flex items-center gap-2">
                    <Link
                      to={
                        currentUser.role === 'admin'
                          ? '/admin'
                          : currentUser.role === 'manager'
                          ? '/manager'
                          : currentUser.role === 'receptionist'
                          ? '/reception'
                          : '/dashboard'
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3.5 py-2 rounded-xl bg-[#2E0854] text-white font-black text-xs hover:bg-purple-900 transition-all flex items-center gap-1.5"
                    >
                      {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {currentUser.role === 'manager' && <Briefcase className="w-3.5 h-3.5" />}
                      {currentUser.role === 'receptionist' && <UserCheck className="w-3.5 h-3.5" />}
                      {currentUser.role === 'guest' && <LayoutDashboard className="w-3.5 h-3.5" />}
                      <span>
                        {currentUser.role === 'admin'
                          ? 'Admin'
                          : currentUser.role === 'manager'
                          ? 'Console'
                          : currentUser.role === 'receptionist'
                          ? 'Desk'
                          : 'Dashboard'}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Log out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
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
