import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Property, Booking, User } from '../../types';
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
  LogOut
} from 'lucide-react';

interface ReceptionDashboardPageProps {
  receptionUser: User | null;
}

export const ReceptionDashboardPage: React.FC<ReceptionDashboardPageProps> = ({ receptionUser }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedViewBooking, setSelectedViewBooking] = useState<Booking | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allProps = await dataService.getProperties('stays');
    const allBookings = await dataService.getBookings();
    setProperties(allProps);
    setBookings(allBookings);
    if (allProps.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(allProps[0].id);
    }
  };

  const handleCheckInGuest = async (bookingId: string) => {
    await dataService.checkInGuest(bookingId);
    loadData();
  };

  // Recalculate price when short_time_hours changes
  const handleShortTimeHoursChange = (hours: number) => {
    setShortTimeHours(hours);
    const selectedProp = properties.find(p => p.id === selectedPropertyId);
    const baseNightPrice = selectedProp ? selectedProp.price_per_night : 200;
    
    // Calculate short-time pricing ratio
    if (hours === 2) setAgreedPrice(Math.round(baseNightPrice * 0.35));
    else if (hours === 4) setAgreedPrice(Math.round(baseNightPrice * 0.50));
    else if (hours === 6) setAgreedPrice(Math.round(baseNightPrice * 0.65));
    else setAgreedPrice(Math.round(baseNightPrice * 0.80));

    // Update checkOutTime calculation
    const [h, m] = checkInTime.split(':').map(Number);
    const outH = (h + hours) % 24;
    setCheckOutTime(`${outH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
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
      
      {/* Front Desk Receptionist Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-navy-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Front Desk Reception Desk</span>
          </div>
          <h1 className="text-3xl font-black">Guest Check-In & Walk-in Desk</h1>
          <p className="text-xs text-emerald-200">
            Welcome {receptionUser?.full_name || 'Abena Osei'}. Check in arriving guests and record overnight or short-time walk-ins.
          </p>
        </div>

        <button
          onClick={() => setShowWalkInModal(true)}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Walk-in / Short-Time Booking</span>
        </button>
      </div>

      {/* Reception Desk Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">In-House Guests</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">{activeInHouse.length}</div>
          <span className="text-[10px] text-gray-400 font-bold">Currently checked in</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Expected Arrivals</span>
          <div className="text-3xl font-black text-amber-600 mt-2">{expectedToday.length}</div>
          <span className="text-[10px] text-gray-400 font-bold">Online & Manager Reservations</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Short-Time Stays</span>
          <div className="text-3xl font-black text-navy-950 mt-2">
            {bookings.filter(b => b.booking_category === 'short_time').length}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">2h / 4h / 6h Hourly Stays</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Calendar Sync</span>
          <div className="text-3xl font-black text-emerald-600 mt-2 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            <span>Active</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">Dates locked upon entry</span>
        </div>
      </div>

      {/* Main Reception Table & Mobile Card View */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-navy-950">Arrival Verification & Front Desk Records</h3>
            <p className="text-xs text-gray-500">Confirm client arrivals for bookings made online, by managers, or by admins</p>
          </div>
        </div>

        {/* Mobile View: Responsive Cards (block md:hidden) */}
        <div className="block md:hidden space-y-4 px-4 pb-6">
          {bookings.map((b) => {
            const isCheckedIn = b.arrival_status === 'checked_in';
            const isShortTime = b.booking_category === 'short_time';
            return (
              <div
                key={b.id}
                onClick={() => setSelectedViewBooking(b)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3.5 ${
                  isCheckedIn ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-purple-100 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-gold-600 text-xs">{b.id}</span>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isShortTime ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isShortTime ? `Short-Time (${b.short_time_hours}h)` : 'Overnight Stay'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-navy-950">{b.guest_name}</h4>
                  <p className="text-xs text-emerald-700 font-mono font-bold">{b.guest_phone}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Residence</span>
                  <span className="font-extrabold text-navy-950">{b.property.title}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 font-semibold pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Dates</span>
                    <span>{b.check_in} &rarr; {b.check_out}</span>
                  </div>
                  <span className="text-xs font-black text-[#2E0854]">${b.total_price}</span>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  {isCheckedIn ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      <CheckCircle className="w-3.5 h-3.5" /> Checked In
                    </span>
                  ) : b.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                      Checked Out (Completed)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedViewBooking(b);
                      }}
                      className="w-full py-3 px-4 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <UserCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Check-In Client</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Clean Responsive Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
              <tr>
                <th className="p-4">Ref & Type</th>
                <th className="p-4">Client Name & Phone</th>
                <th className="p-4">Residence Reserved</th>
                <th className="p-4">Dates & Time</th>
                <th className="p-4">Booked By</th>
                <th className="p-4 text-right">Arrival Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
              {bookings.map((b) => {
                const isCheckedIn = b.arrival_status === 'checked_in';
                const isShortTime = b.booking_category === 'short_time';
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedViewBooking(b)}
                    className={`cursor-pointer transition-colors ${isCheckedIn ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-purple-50/30'}`}
                  >
                    <td className="p-4">
                      <span className="font-mono font-black text-gold-600 block">{b.id}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isShortTime ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isShortTime ? `Short-Time (${b.short_time_hours}h)` : 'Overnight Stay'}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-navy-950">{b.guest_name}</p>
                      <p className="text-gray-400 text-[11px]">{b.guest_email}</p>
                      <p className="text-emerald-700 text-[11px] font-mono font-bold">{b.guest_phone}</p>
                    </td>

                    <td className="p-4 font-extrabold text-[#2E0854] max-w-[200px] truncate">{b.property.title}</td>

                    <td className="p-4">
                      <span>{b.check_in} &rarr; {b.check_out}</span>
                      {isShortTime ? (
                        <span className="block text-[10px] text-purple-700 font-bold">
                          ⏰ {b.check_in_time} - {b.check_out_time} (Out)
                        </span>
                      ) : (
                        <span className="block text-[10px] text-gray-400 font-bold">
                          Check-Out: {b.check_out} 12:00 PM
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-navy-950 font-bold block">
                        {b.created_by_name || b.created_by_role || 'Online Guest'}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-gray-400">
                        {b.created_by_role || 'Online'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {isCheckedIn ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                              <CheckCircle className="w-3.5 h-3.5" /> Checked In
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                await dataService.checkOutGuest(b.id);
                                loadData();
                              }}
                              className="px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] shadow-sm transition-all"
                            >
                              Check-Out
                            </button>
                          </div>
                        ) : b.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                            Checked Out (Completed)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedViewBooking(b)}
                            className="px-4 py-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                          >
                            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Check-In Client</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Walk-in / Short-Time Booking */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-base">Front Desk Walk-in Registration</h3>
              </div>
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
                onClick={() => {
                  setBookingCategory('overnight');
                  setAgreedPrice(250);
                }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  bookingCategory === 'overnight' ? 'bg-navy-950 text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                Overnight Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingCategory('short_time');
                  handleShortTimeHoursChange(4);
                }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  bookingCategory === 'short_time' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-gray-500'
                }`}
              >
                ⚡ Short-Time (Hourly)
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
                      <Clock className="w-3.5 h-3.5 text-gold-600" />
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
                className="w-full py-3.5 bg-navy-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-navy-900 transition-all"
              >
                <Lock className="w-4 h-4 text-gold-400" />
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
