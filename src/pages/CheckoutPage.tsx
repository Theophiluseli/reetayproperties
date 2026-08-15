import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Property, User } from '../types';
import { dataService } from '../lib/supabase';
import { ShieldCheck, ArrowLeft, Lock, User as UserIcon, Sparkles, X, CheckCircle } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    property: Property;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  } | null;

  const [fullName, setFullName] = useState('David Reetay');
  const [email, setEmail] = useState('david@reetay.com');
  const [phone, setPhone] = useState('+233 24 123 4567');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthChoiceModal, setShowAuthChoiceModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  React.useEffect(() => {
    dataService.getCurrentUser().then(u => setCurrentUser(u));
  }, []);

  if (!state || !state.property) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center space-y-4 shadow-sm">
        <p className="text-sm font-bold text-navy-950">No active booking session found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#2E0854] text-white rounded-full text-xs font-bold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  const { property, checkIn, checkOut, guests, totalPrice } = state;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthChoiceModal(true);
    } else {
      executeBooking();
    }
  };

  const executeBooking = async () => {
    setShowAuthChoiceModal(false);
    setLoading(true);

    try {
      const newBooking = await dataService.createBooking(
        property.id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        {
          guest_name: fullName,
          guest_email: email,
          guest_phone: phone,
          special_requests: specialRequests
        }
      );
      navigate(`/booking/${newBooking.id}/confirmation`, {
        state: { booking: newBooking }
      });
    } catch (err: any) {
      alert(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#2E0854] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Details</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-[#2E0854]">Confirm & Complete Direct Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Guest Info & Confirmation Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Step 1: Guest Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-[#2E0854] flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#2E0854] text-white text-xs font-black flex items-center justify-center shadow-md">1</span>
                  <span>Guest & Booking Contact Details</span>
                </h3>
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Direct Booking
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold text-navy-950 outline-none focus:border-[#2E0854] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold text-navy-950 outline-none focus:border-[#2E0854] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Phone Number (For WhatsApp Confirmation & Support)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold text-navy-950 outline-none focus:border-[#2E0854] transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Special Requests / Arrival Flight Number</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Arriving on BA081 at 5 PM, request late check-in or airport shuttle."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-medium text-navy-950 outline-none focus:border-[#2E0854] transition-all"
                />
              </div>

              {/* Guarantee & Direct Booking Info Banner */}
              <div className="flex items-start gap-3 bg-purple-50/70 border border-purple-100 p-4 rounded-2xl text-xs text-[#2E0854]">
                <ShieldCheck className="w-5 h-5 text-[#2E0854] flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold">Instant Direct Reservation Guarantee</p>
                  <p className="text-gray-600 font-normal">Your reservation is confirmed directly with our host team. Payment details will be handled upon arrival or official check-in confirmation.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#2E0854] hover:bg-black text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Processing Direct Booking...' : 'Confirm & Reserve Booking'}</span>
            </button>

          </form>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-lg space-y-4 sticky top-24">
            <h3 className="text-base font-extrabold text-[#2E0854] border-b border-gray-100 pb-3">Reservation Summary</h3>
            
            <div className="flex gap-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-navy-950 line-clamp-2">{property.title}</p>
                <p className="text-[11px] text-gray-400 mt-1">{property.location.area}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-bold text-navy-950">{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-bold text-navy-950">{checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span className="font-bold text-navy-950">{guests} Guest{guests > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Stay Total:</span>
                <span>{property.currency}{totalPrice}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Direct Booking Fee:</span>
                <span>FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-black text-[#2E0854]">
                <span>Total Amount:</span>
                <span>{property.currency}{totalPrice.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Auth Choice Popup Modal */}
      {showAuthChoiceModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative space-y-6 text-center">
            
            <button
              onClick={() => setShowAuthChoiceModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 text-[#2E0854] flex items-center justify-center mx-auto shadow-inner">
              <UserIcon className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#2E0854]">How would you like to continue?</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Sign up for a Reetay account to track reservations and manage your trips, or continue directly as a guest.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: Continue as Guest */}
              <button
                type="button"
                onClick={executeBooking}
                className="w-full py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#2E0854] font-black text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Continue as Guest</span>
              </button>

              {/* Option 2: Sign Up / Log In */}
              <button
                type="button"
                onClick={() => {
                  setShowAuthChoiceModal(false);
                  setShowAuthModal(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E0854] hover:bg-black text-white font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Sign Up / Log In</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Auth Modal for Sign Up / Log In */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode="signup"
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setShowAuthModal(false);
          executeBooking();
        }}
      />

    </div>
  );
};
