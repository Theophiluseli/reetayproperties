import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { useRealtimeSync } from '../../lib/realtimeSync';
import { Property, Booking, User } from '../../types';
import { IncomingReservationsDesk } from '../../components/dashboard/IncomingReservationsDesk';
import {
  UserCheck,
  Plus,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Lock,
  X,
  Sparkles,
  Bed,
  LogOut,
  Calendar,
  RefreshCw
} from 'lucide-react';

import { StaffPermissions, ShiftHandover } from '../../types';

import { Link, Navigate } from 'react-router-dom';

interface ReceptionDashboardPageProps {
  receptionUser: User | null;
}

export const ReceptionDashboardPage: React.FC<ReceptionDashboardPageProps> = ({ receptionUser }) => {
  if (!receptionUser) {
    return <Navigate to="/portal/login" replace />;
  }
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedViewBooking, setSelectedViewBooking] = useState<Booking | null>(null);

  // Shift, Calendar Sync & Permissions State
  const [staffPermissions, setStaffPermissions] = useState<StaffPermissions | undefined>(undefined);
  const [shiftHandovers, setShiftHandovers] = useState<ShiftHandover[]>([]);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCalendarSyncModal, setShowCalendarSyncModal] = useState(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [shiftNotes, setShiftNotes] = useState('');
  const [shiftStartTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const handleForceResync = async () => {
    setIsSyncingCalendar(true);
    await loadData();
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsSyncingCalendar(false);
    }, 800);
  };

  // Form State
  const [bookingCategory, setBookingCategory] = useState<'overnight' | 'short_time'>('short_time');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(new Date().toISOString().split('T')[0]);
  const [shortTimeHours, setShortTimeHours] = useState(4);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('18:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [agreedPrice, setAgreedPrice] = useState(100);
  const [specialNotes, setSpecialNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useRealtimeSync(['properties', 'bookings', 'users', 'shift_handovers'], () => {
    loadData();
  });

  useEffect(() => {
    loadData();
    const handleOpenShiftModal = () => setShowShiftModal(true);
    window.addEventListener('open-shift-modal', handleOpenShiftModal);
    return () => window.removeEventListener('open-shift-modal', handleOpenShiftModal);
  }, [receptionUser]);

  const loadData = async () => {
    const allProps = await dataService.getProperties('stays');
    const allBookings = await dataService.getBookings();
    const handovers = await dataService.getShiftHandovers();
    setProperties(allProps);
    setBookings(allBookings);
    setShiftHandovers(handovers);

    if (allProps.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(allProps[0].id);
    }

    // Match permissions for current logged in receptionist
    const staffList = await dataService.getStaffAccounts();
    const currentUserEmail = receptionUser?.email || 'reception@reetay.com';
    const currentStaff = staffList.find(s => s.email.toLowerCase() === currentUserEmail.toLowerCase());
    if (currentStaff && currentStaff.permissions) {
      setStaffPermissions(currentStaff.permissions);
    }
  };

  const handleCompleteShiftHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeCheckedIn = bookings.filter(b => b.arrival_status === 'checked_in').length;
    const completedCheckouts = bookings.filter(b => b.status === 'completed').length;

    await dataService.createShiftHandover({
      shift_staff_name: receptionUser?.full_name || 'Front Desk Receptionist',
      shift_staff_email: receptionUser?.email || 'reception@reetay.com',
      start_time: shiftStartTime,
      notes: shiftNotes || 'Shift change complete. All live check-in keys and room statuses updated.',
      checkins_completed: activeCheckedIn,
      checkouts_completed: completedCheckouts
    });

    setShowShiftModal(false);
    setShiftNotes('');
    await dataService.logout();
    window.location.href = '/portal/login';
  };

  const handleCheckInGuest = async (bookingId: string) => {
    await dataService.checkInGuest(bookingId);
    loadData();
  };

  // Automatically update Total Price Charged whenever selected room, stay dates, category, or duration changes
  useEffect(() => {
    if (!selectedPropertyId || properties.length === 0) return;
    const selectedProp = properties.find(p => p.id === selectedPropertyId);
    if (!selectedProp) return;

    if (bookingCategory === 'overnight') {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const nights = diffDays > 0 ? diffDays : 1;
      setAgreedPrice(selectedProp.price_per_night * nights);
    } else {
      const baseNightPrice = selectedProp.price_per_night;
      if (shortTimeHours === 2) setAgreedPrice(Math.round(baseNightPrice * 0.35));
      else if (shortTimeHours === 4) setAgreedPrice(Math.round(baseNightPrice * 0.50));
      else if (shortTimeHours === 6) setAgreedPrice(Math.round(baseNightPrice * 0.65));
      else setAgreedPrice(Math.round(baseNightPrice * 0.80));

      const [h, m] = checkInTime.split(':').map(Number);
      const outH = (h + shortTimeHours) % 24;
      setCheckOutTime(`${outH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }, [selectedPropertyId, checkInDate, checkOutDate, bookingCategory, shortTimeHours, checkInTime, properties]);

  // Recalculate price when short_time_hours changes
  const handleShortTimeHoursChange = (hours: number) => {
    setShortTimeHours(hours);
  };

  const handleRegisterBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await dataService.createWalkInBooking({
        propertyId: selectedPropertyId,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        checkIn: checkInDate,
        checkOut: bookingCategory === 'short_time' ? checkInDate : checkOutDate,
        guests: guestsCount,
        totalPrice: agreedPrice,
        special_requests: specialNotes,
        booking_category: bookingCategory,
        short_time_hours: bookingCategory === 'short_time' ? shortTimeHours : undefined,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        created_by_role: 'receptionist',
        created_by_name: receptionUser?.full_name || 'Abena Osei (Receptionist)'
      });
      setShowWalkInModal(false);
      // Reset
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      loadData();
      alert(`Booking registered! ${bookingCategory === 'short_time' ? `Short-time stay (${shortTimeHours}h)` : 'Overnight stay'} locked on calendar.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error recording booking');
    }
  };

  const activeInHouse = bookings.filter(b => b.status === 'active' || b.arrival_status === 'checked_in');
  const expectedToday = bookings.filter(b => b.arrival_status !== 'checked_in' && b.status !== 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      


      {/* Reception Desk Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: In-House Guests */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm space-y-1.5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">In-House Guests</span>
            <div className="w-7 h-7 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{activeInHouse.length}</div>
          <span className="text-[10px] text-emerald-700/80 font-bold block">Currently checked in</span>
        </div>

        {/* Card 2: Expected Arrivals */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-white p-5 rounded-3xl border border-amber-200/80 shadow-sm space-y-1.5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider">Expected Arrivals</span>
            <div className="w-7 h-7 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{expectedToday.length}</div>
          <span className="text-[10px] text-amber-700/80 font-bold block">Online & Manager Reservations</span>
        </div>

        {/* Card 3: Short-Time Stays */}
        <div className="bg-gradient-to-br from-purple-50/70 via-white to-white p-5 rounded-3xl border border-purple-200/80 shadow-sm space-y-1.5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider">Short-Time Stays</span>
            <div className="w-7 h-7 rounded-full bg-purple-100/80 flex items-center justify-center text-purple-700">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-950">
            {bookings.filter(b => b.booking_category === 'short_time').length}
          </div>
          <span className="text-[10px] text-purple-800/80 font-bold block">2h / 4h / 6h Hourly Stays</span>
        </div>

        {/* Card 4: Calendar Sync */}
        <div className="bg-gradient-to-br from-teal-50/70 via-white to-white p-5 rounded-3xl border border-teal-200/80 shadow-sm space-y-1.5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-teal-800 uppercase tracking-wider">Calendar Sync</span>
            <div className="w-7 h-7 rounded-full bg-teal-100/80 flex items-center justify-center text-teal-700">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-teal-600 flex items-center gap-1.5">
            <span>Active</span>
          </div>
          <span className="text-[10px] text-teal-700/80 font-bold block">Dates locked upon entry</span>
        </div>
      </div>

      {/* Incoming Reservations & Check-In Desk */}
      <IncomingReservationsDesk
        bookings={bookings}
        properties={properties}
        onRefresh={loadData}
        currentUserRole="receptionist"
        currentUserName={receptionUser?.full_name || 'Abena Osei'}
        permissions={staffPermissions}
      />

      {/* Modal: Shift Handover & Log Notes */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-700" />
                <h3 className="font-extrabold text-navy-950 text-base">Complete Shift & Handover Log</h3>
              </div>
              <button onClick={() => setShowShiftModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-1 font-semibold text-navy-950">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[10px]">Outgoing Staff:</span>
                <span className="font-bold">{receptionUser?.full_name || 'Front Desk Staff'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[10px]">Shift Start:</span>
                <span className="font-bold">{shiftStartTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[10px]">In-House Guests:</span>
                <span className="font-bold text-emerald-600">{activeInHouse.length} Guests</span>
              </div>
            </div>

            <form onSubmit={handleCompleteShiftHandover} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Shift Handover Notes & Operational Comments
                </label>
                <textarea
                  rows={4}
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="Record keys handed over, special guest requests, pending cash collections, or room maintenance notes for the incoming receptionist..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-navy-950 outline-none"
                  required
                />
              </div>



              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md"
                >
                  Submit Handover & Logout Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-navy-950 text-base">Front Desk Walk-in Registration</h3>
              <button onClick={() => setShowWalkInModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 font-bold">
                {errorMessage}
              </div>
            )}

            {/* Category Toggle: Overnight vs Short-Time */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBookingCategory('overnight')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  bookingCategory === 'overnight' ? 'bg-navy-950 text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                Overnight Stay
              </button>
              <button
                type="button"
                onClick={() => setBookingCategory('short_time')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  bookingCategory === 'short_time' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-gray-500'
                }`}
              >
                Short-Time (Hourly)
              </button>
            </div>

            <form onSubmit={handleRegisterBooking} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Property</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none cursor-pointer"
                  required
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (${p.price_per_night}/night) - {p.location.area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Short-time hours selector */}
              {bookingCategory === 'short_time' && (
                <div className="bg-gold-50/70 p-3 rounded-2xl border border-gold-200 space-y-2">
                  <label className="text-[10px] uppercase font-black text-amber-900 block">Select Short-Time Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 4, 6, 8].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleShortTimeHoursChange(h)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all ${
                          shortTimeHours === h
                            ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {h} Hours
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kwame Bediako"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Email</label>
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Stay Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                {bookingCategory === 'overnight' ? (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Time Slot (Check in/out)</label>
                    <div className="flex items-center gap-1 text-xs font-bold text-navy-950 bg-gray-50 p-2 rounded-xl border border-gray-200">
                      <span>{checkInTime} - {checkOutTime}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Price Charged ($)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-gold-700 outline-none text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-navy-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center hover:bg-navy-900 transition-all"
              >
                <span>Confirm {bookingCategory === 'short_time' ? 'Short-Time' : 'Overnight'} & Lock Calendar</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Booking Details & Date Check Verification */}
      {selectedViewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-100 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedViewBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Title */}
            <div className="space-y-1 text-left border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2E0854] text-[10px] font-mono font-black uppercase">
                  Ref: {selectedViewBooking.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
                  {selectedViewBooking.arrival_status === 'checked_in' ? 'Checked-In' : 'Direct Booking'}
                </span>
              </div>
              <h2 className="text-xl font-black text-[#2E0854]">Reservation Details & Verification</h2>
              <p className="text-xs text-gray-500 font-medium">Review client information and verify stay dates before check-in.</p>
            </div>

            {/* Residence Info */}
            <div className="flex gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100/80">
              <img
                src={selectedViewBooking.property.images[0]}
                alt={selectedViewBooking.property.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-navy-950 truncate">{selectedViewBooking.property.title}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{selectedViewBooking.property.location.address}</p>
                <p className="text-[11px] font-bold text-[#2E0854] mt-1">${selectedViewBooking.total_price} Total</p>
              </div>
            </div>

            {/* Client Details Grid */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <h5 className="font-extrabold text-navy-950 uppercase text-[10px] tracking-wider text-gray-400">Client Information</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-navy-950 font-bold">
                <div>
                  <span className="text-[10px] text-gray-400 block font-normal">Full Name:</span>
                  <span>{selectedViewBooking.guest_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-normal">Phone Number:</span>
                  <a href={`https://wa.me/${selectedViewBooking.guest_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-mono">
                    {selectedViewBooking.guest_phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-normal">Email Address:</span>
                  <span className="text-gray-700">{selectedViewBooking.guest_email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-normal">Total Guests:</span>
                  <span>{selectedViewBooking.guests} Person{selectedViewBooking.guests > 1 ? 's' : ''}</span>
                </div>
              </div>
              {selectedViewBooking.special_requests && (
                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] text-gray-400 block font-normal">Special Requests / Flight:</span>
                  <span className="text-gray-700 italic font-normal">{selectedViewBooking.special_requests}</span>
                </div>
              )}
            </div>

            {/* Stay Dates Verification Box */}
            <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 uppercase text-[10px] tracking-wider">Dates & Time Verification</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center bg-white p-3 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">CHECK-IN</span>
                  <span className="text-xs font-black text-emerald-950">{selectedViewBooking.check_in}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">CHECK-OUT</span>
                  <span className="text-xs font-black text-emerald-950">{selectedViewBooking.check_out}</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 font-medium leading-tight">
                ✓ Verified: Calendar dates are checked and locked for this client's reservation.
              </p>
            </div>

            {/* Check-In Client Action Button (Matching Screenshot) */}
            {selectedViewBooking.arrival_status !== 'checked_in' ? (
              <button
                type="button"
                onClick={async () => {
                  await handleCheckInGuest(selectedViewBooking.id);
                  setSelectedViewBooking(null);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Check–In Client</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-full text-center text-xs font-black uppercase flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Client Already Checked-In</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
