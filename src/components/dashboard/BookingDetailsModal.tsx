import React from 'react';
import { Booking } from '../../types';
import { X, Calendar, MapPin, CheckCircle, Printer, ExternalLink, ShieldCheck, User, Phone, Mail, Clock, DollarSign } from 'lucide-react';
import { ReetayLogo } from '../common/ReetayLogo';
import { Link } from 'react-router-dom';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment?: (bookingId: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirmPayment
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPending = booking.payment_status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-8 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none printable-invoice">
        
        {/* Close button (Hidden when printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- PRINTABLE & SCREEN INVOICE HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2E0854] rounded-2xl flex items-center justify-center shadow-md">
              <ReetayLogo size="sm" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2E0854]">REETAY APARTMENTS & LUXURY SUITES</h2>
              <p className="text-xs text-gray-500 font-medium">14 Independence Avenue, Airport Residential Area, Accra</p>
              <p className="text-[10px] text-gray-400 font-mono">Tel: +233 24 123 4567 | concierge@reetay.com</p>
            </div>
          </div>

          <div className="sm:text-right">
            {isPending ? (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                PENDING MANUAL PAYMENT
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                CONFIRMED • PAID
              </span>
            )}
            <p className="text-xs font-mono text-gray-600 font-bold mt-1">
              REF: #{booking.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Property & Stay Card Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 mb-6">
          <img
            src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
            alt={booking.property?.title}
            className="w-full sm:w-28 h-24 rounded-xl object-cover"
          />
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase text-purple-900 tracking-wider">Reserved Property</span>
            <h3 className="text-base font-black text-[#2E0854]">{booking.property?.title || 'Luxury Suite'}</h3>
            <p className="text-xs text-gray-600 flex items-center justify-center sm:justify-start gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-700" />
              {booking.property?.location?.address || 'Airport Residential, Accra'}
            </p>
          </div>
        </div>

        {/* Guest & Reservation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-xs">
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">Guest Information</span>
            <p className="font-extrabold text-[#2E0854] text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-700" />
              {booking.guest_name || 'Valued Guest'}
            </p>
            <p className="text-gray-600 flex items-center gap-1.5 text-[11px]">
              <Mail className="w-3 h-3 text-gray-400" />
              {booking.guest_email || 'N/A'}
            </p>
            <p className="text-gray-600 flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3 h-3 text-gray-400" />
              {booking.guest_phone || 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-xs">
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">Stay Schedule</span>
            <div className="grid grid-cols-2 gap-2 text-navy-950 font-bold">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Check-In</span>
                <span>{booking.check_in}</span>
                <span className="text-[10px] text-gray-400 block font-normal">{booking.check_in_time || '14:00 GMT'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Check-Out</span>
                <span>{booking.check_out}</span>
                <span className="text-[10px] text-gray-400 block font-normal">{booking.check_out_time || '11:00 GMT'}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Occupancy: <strong className="text-navy-950">{booking.guests} Guests</strong> | Category: <strong className="text-navy-950 capitalize">{booking.booking_category || 'Overnight'}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Financial Breakdown Table */}
        <div className="mb-6 space-y-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Financial Summary</span>
          <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-gray-100 p-3 flex justify-between font-extrabold text-[#2E0854] border-b border-gray-200">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div className="p-3 flex justify-between font-semibold text-navy-950 border-b border-gray-100">
              <span>{booking.property?.title || 'Accommodation Booking'} ({booking.guests} Guests)</span>
              <span className="font-bold">{booking.currency || '$'}{booking.total_price}</span>
            </div>
            <div className="p-3 flex justify-between text-gray-500 border-b border-gray-100 text-[11px]">
              <span>Taxes & Service Fees (Included)</span>
              <span>$0.00</span>
            </div>
            <div className="p-3.5 bg-purple-50 flex justify-between items-center font-black text-[#2E0854] text-sm">
              <span>Total Settled Amount</span>
              <span className="text-lg text-[#2E0854]">{booking.currency || '$'}{booking.total_price}</span>
            </div>
          </div>
        </div>

        {/* Special Requests if any */}
        {booking.special_requests && (
          <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 block mb-0.5">Special Requests / Desk Notes:</span>
            <p className="text-amber-900 font-medium italic">{booking.special_requests}</p>
          </div>
        )}

        {/* Verification Stamp */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-navy-950">Verified & Authenticated by Reetay Concierge</span>
          </div>
          <span className="font-mono text-[10px] text-gray-400">STAMP-RET-{booking.id}</span>
        </div>

        {/* Screen Buttons (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 print:hidden pt-2 border-t border-gray-100">
          {isPending && onConfirmPayment && (
            <button
              onClick={() => onConfirmPayment(booking.id)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>Confirm Manual Payment & Approve</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all"
          >
            Close
          </button>

          <Link
            to={`/stays/${booking.property_id}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-purple-100 text-[#2E0854] font-bold text-xs hover:bg-purple-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View Property</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2E0854] hover:bg-black text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-gold-400" />
            <span>Print 1-Page Invoice PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
