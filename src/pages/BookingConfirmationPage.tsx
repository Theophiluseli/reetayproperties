import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Booking } from '../types';
import { CheckCircle2, Calendar, MapPin, Download, LayoutDashboard, QrCode } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const booking = (location.state as { booking: Booking })?.booking;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
      
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50/60 animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-navy-950">Booking Confirmed!</h1>
        <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
          Your luxury stay has been reserved. A confirmation receipt and check-in guide have been sent to your email.
        </p>
        <div className="inline-block bg-gray-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-navy-950 mt-2">
          Reference Number: {booking?.id || id || 'BK-89021'}
        </div>
      </div>

      {/* Confirmation Voucher Card */}
      {booking && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-left space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-extrabold text-navy-950 text-base">{booking.property.title}</h3>
              <p className="text-xs text-gray-400">{booking.property.location.address}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-navy-950">
              <QrCode className="w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
            <div>
              <span className="text-[10px] uppercase text-gray-400 font-bold block">Check-in Date</span>
              <span className="text-navy-950 font-extrabold">{booking.check_in}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-400 font-bold block">Check-out Date</span>
              <span className="text-navy-950 font-extrabold">{booking.check_out}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-400 font-bold block">Guests</span>
              <span className="text-navy-950 font-extrabold">{booking.guests} Guests</span>
            </div>
          </div>

          <div className="bg-gold-50/60 p-4 rounded-2xl border border-gold-200/60 flex items-center justify-between">
            <span className="text-xs font-bold text-navy-950">Total Paid Amount:</span>
            <span className="text-lg font-black text-gold-700">{booking.currency}{booking.total_price}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/dashboard/bookings"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4 text-gold-400" />
          <span>Manage in Dashboard</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-navy-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-gray-600" />
          <span>Download Receipt PDF</span>
        </button>
      </div>

    </div>
  );
};
