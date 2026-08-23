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
  Clock
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
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/reception');

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

            {/* Center Area: Public Vertical Tabs OR Dedicated Dashboard Title Badge */}
            {!isDashboardRoute ? (
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

            {/* User Controls (Right) - Only show dropdown for Staff/Admin Accounts */}
            <div className="flex items-center gap-3 ml-auto">
              {currentUser && currentUser.role !== 'guest' ? (
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
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      
                      {/* Header with Role Badge */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/40 rounded-t-2xl">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-[10px] font-black uppercase text-gray-400">Account Role</p>
                          {currentUser.role === 'receptionist' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase">
                              Receptionist
                            </span>
                          )}
                          {currentUser.role === 'manager' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[9px] uppercase">
                              Manager
                            </span>
                          )}
                          {currentUser.role === 'admin' && (
                            <span className="px-2 py-0.5 rounded-full bg-[#2E0854] text-white font-black text-[9px] uppercase">
                              Executive Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-navy-950 truncate">{currentUser.full_name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                      </div>

                      {/* Menu Options for RECEPTIONIST */}
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
                          <Link
                            to="/reception"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-emerald-500" />
                            <span>Check-ins & Guests</span>
                          </Link>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              window.dispatchEvent(new CustomEvent('open-shift-modal'));
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors border-t border-gray-100 mt-1 pt-2"
                          >
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>End Shift & Handover Log</span>
                          </button>
                        </div>
                      )}

                      {/* Menu Options for MANAGER */}
                      {currentUser.role === 'manager' && (
                        <div className="py-1">
                          <Link
                            to="/manager?tab=bookings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-navy-950 hover:bg-gold-50 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-gold-600" />
                            <span>Manager Console</span>
                          </Link>
                          <Link
                            to="/manager?tab=listings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Bed className="w-4 h-4 text-gold-500" />
                            <span>Property & Vehicle Inventory</span>
                          </Link>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              window.dispatchEvent(new CustomEvent('open-shift-modal'));
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors border-t border-gray-100 mt-1 pt-2"
                          >
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>End Shift & Handover Log</span>
                          </button>
                        </div>
                      )}

                      {/* Menu Options for ADMIN */}
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
                          <Link
                            to="/admin?tab=staff"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>Staff Accounts & Access</span>
                          </Link>
                          <Link
                            to="/admin?tab=financials"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-gold-600" />
                            <span>Financial Audit & Revenue</span>
                          </Link>
                          <Link
                            to="/admin?tab=listings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Bed className="w-4 h-4 text-blue-600" />
                            <span>Property Inventory</span>
                          </Link>
                          <Link
                            to="/admin?tab=incidents"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-rose-600" />
                            <span>Guest Incident Reports</span>
                          </Link>
                        </div>
                      )}

                      {/* Logout */}
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
            </div>
          </div>
        </div>
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
