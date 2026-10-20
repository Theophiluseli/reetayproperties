import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Booking, User } from '../types';
import { CheckCircle2, Calendar, MapPin, Download, LayoutDashboard, QrCode, ShieldCheck, Printer, Lock, UserCheck, Clock } from 'lucide-react';
import { ReetayLogo } from '../components/common/ReetayLogo';
import { AuthModal } from '../components/auth/AuthModal';
import { dataService } from '../lib/supabase';
import { useRealtimeSync } from '../lib/realtimeSync';

interface BookingConfirmationPageProps {
  currentUser?: User | null;
  onLoginSuccess?: (user: User) => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ currentUser, onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const passedBooking = (location.state as { booking: Booking })?.booking;
  const [booking, setBooking] = useState<Booking | null>(passedBooking || null);

  const refreshBooking = async () => {
    const targetId = booking?.id || id;
    if (!targetId) return;
    try {
      setIsRefreshing(true);
      const allBookings = await dataService.getBookings();
      const found = allBookings.find((b: Booking) => b.id.toLowerCase() === targetId.toLowerCase());
      if (found) {
        setBooking(found);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real-time synchronization: when admin marks payment as paid or confirms booking, page flips instantly
  useRealtimeSync(['bookings', 'properties'], () => {
    refreshBooking();
  });

  React.useEffect(() => {
    refreshBooking();
    const interval = setInterval(refreshBooking, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const isConfirmed = booking ? booking.payment_status === 'paid' : false;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleManageDashboard = () => {
    if (currentUser) {
      navigate('/dashboard/bookings');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8 animate-in fade-in">
      
      {/* Screen Badge & Title */}
      {isConfirmed ? (
        <>
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50/60 animate-bounce print:hidden">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2 print:hidden">
            <h1 className="text-3xl font-black text-navy-950">Booking Confirmed!</h1>
            <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
              Your reservation has been completed. An official confirmation receipt has been generated.
            </p>
            <div className="inline-block bg-gray-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-navy-950 mt-2">
              Invoice Ref: #RET-INV-{(booking?.id || id || 'BK-89021').toUpperCase()}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center ring-8 ring-amber-50/60 animate-pulse print:hidden">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-2 print:hidden">
            <h1 className="text-3xl font-black text-navy-950">Booking Received — Awaiting Confirmation</h1>
            <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
              Your reservation request has been received. Please wait for admin payment verification and confirmation.
            </p>
            <div className="inline-block bg-amber-100/70 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-amber-950 border border-amber-200 mt-2">
              Reservation Ref: #RET-REQ-{(booking?.id || id || 'BK-89021').toUpperCase()}
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={refreshBooking}
                disabled={isRefreshing}
                className="px-4 py-2 bg-navy-950 text-white rounded-full text-xs font-bold hover:bg-navy-900 transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Clock className={`w-3.5 h-3.5 text-gold-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Checking Status...' : 'Check Live Status'}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Official Printable Invoice Voucher Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-left space-y-6 print:shadow-none print:border-none print:p-0 print:m-0 printable-invoice">
        
        {/* Official Reetay Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2E0854] rounded-2xl flex items-center justify-center shadow-md">
              <ReetayLogo size="sm" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2E0854]">REETAY APARTMENTS & LUXURY SUITES</h2>
              <p className="text-xs text-gray-600 font-semibold">14 Independence Avenue, Airport Residential Area, Accra, Ghana</p>
              <p className="text-[10px] text-gray-400 font-mono">Tel: +233 24 123 4567 | Email: concierge@reetay.com</p>
            </div>
          </div>

          <div className="sm:text-right">
            {booking?.payment_status === 'paid' ? (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                OFFICIAL INVOICE • CONFIRMED & PAID
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                RESERVATION REQUEST • PENDING ADMIN PAYMENT VERIFICATION
              </span>
            )}
            <p className="text-xs font-mono text-gray-600 font-bold mt-1">
              INV: #RET-{(booking?.id || id || '89021').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Client & Booking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/40 p-4 rounded-2xl border border-purple-100 text-xs">
          <div>
            <span className="text-[10px] uppercase text-purple-900 font-black block tracking-wider">Guest Billing To</span>
            <span className="font-extrabold text-navy-950 text-sm block mt-0.5">{booking?.guest_name || 'Valued Guest'}</span>
            <span className="text-gray-600 block text-[11px]">{booking?.guest_email || 'guest@reetay.com'}</span>
            <span className="text-gray-600 block text-[11px]">{booking?.guest_phone || '+233 24 000 0000'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-purple-900 font-black block tracking-wider">Reservation Package</span>
            <span className="font-extrabold text-navy-950 text-sm block mt-0.5">{booking?.property?.title || 'Luxury Residence Stay'}</span>
            <span className="text-gray-600 block text-[11px]">{booking?.property?.location?.address || 'Airport Residential, Accra'}</span>
          </div>
        </div>

        {/* Schedule & Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-600 border-t border-b border-gray-100 py-4">
          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold block">Check-In</span>
            <span className="text-navy-950 font-extrabold">{booking?.check_in || '2026-09-10'}</span>
            <span className="text-[10px] text-gray-400 block">{booking?.check_in_time || '14:00 GMT'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold block">Check-Out</span>
            <span className="text-navy-950 font-extrabold">{booking?.check_out || '2026-09-14'}</span>
            <span className="text-[10px] text-gray-400 block">{booking?.check_out_time || '11:00 GMT'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold block">Guests / Slot</span>
            <span className="text-navy-950 font-extrabold">{booking?.guests || 2} Persons</span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold block">Category</span>
            <span className="text-navy-950 font-extrabold capitalize">{booking?.booking_category || 'Overnight Stay'}</span>
          </div>
        </div>

        {/* Charges Table */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Itemized Financial Summary</span>
          <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-gray-100 p-3 flex justify-between font-bold text-gray-600 border-b border-gray-200">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="p-3 flex justify-between font-semibold text-navy-950 border-b border-gray-100">
              <span>{booking?.property?.title || 'Reservation Accommodations'}</span>
              <span>{booking?.currency || '$'}{booking?.total_price || 420}</span>
            </div>
            <div className="p-3 flex justify-between font-semibold text-gray-500 border-b border-gray-100 text-[11px]">
              <span>Taxes & Service Fees (Included)</span>
              <span>$0.00</span>
            </div>
            <div className="p-3.5 bg-purple-50/60 flex justify-between items-center font-black text-navy-950 text-sm">
              <span>Total Settled Amount</span>
              <span className="text-lg text-[#2E0854]">{booking?.currency || '$'}{booking?.total_price || 420}</span>
            </div>
          </div>
        </div>

        {/* Verification Stamp Footer */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-navy-950">Verified & Authenticated by Reetay Apartments Concierge</span>
          </div>
          <span className="font-mono text-[10px] text-gray-400">VERIFIED-STAMP-RET2026</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <button
          onClick={handleManageDashboard}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <UserCheck className="w-4 h-4 text-gold-400" />
          <span>{currentUser ? 'View Booking Details in Dashboard' : 'Log in to view your booking details'}</span>
        </button>
        <button
          onClick={handlePrintReceipt}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2E0854] hover:bg-black text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4 text-gold-400" />
          <span>Print / Download Receipt PDF</span>
        </button>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
          onSuccess={(user) => {
            if (onLoginSuccess) onLoginSuccess(user);
            setShowAuthModal(false);
            navigate('/dashboard/bookings');
          }}
        />
      )}

    </div>
  );
};

