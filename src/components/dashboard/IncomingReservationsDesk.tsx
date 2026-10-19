import React, { useState } from 'react';
import { Property, Booking, User, StaffPermissions, VerticalType } from '../../types';
import { dataService } from '../../lib/supabase';
import { BookingDetailsModal } from './BookingDetailsModal';
import {
  UserCheck,
  Plus,
  Clock,
  CheckCircle,
  Mail,
  Trash2,
  Lock,
  X,
  Bed,
  LogOut,
  Send,
  Car,
  Sparkles,
  Eye,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckSquare,
  Square,
  FileWarning,
  ShieldAlert
} from 'lucide-react';

const DEFAULT_INVENTORY_ITEMS: Array<{ id: string; category: 'Kitchen Area' | 'Living Room / Room' | 'Bathroom'; name: string; expectedQuantity: number }> = [
  // Kitchen Area
  { id: 'k1', category: 'Kitchen Area', name: 'Rice Cooker', expectedQuantity: 1 },
  { id: 'k2', category: 'Kitchen Area', name: 'Toaster', expectedQuantity: 1 },
  { id: 'k3', category: 'Kitchen Area', name: 'Kettle', expectedQuantity: 1 },
  { id: 'k4', category: 'Kitchen Area', name: 'Big Size Blender', expectedQuantity: 1 },
  { id: 'k5', category: 'Kitchen Area', name: 'Small Size Blender', expectedQuantity: 1 },
  { id: 'k6', category: 'Kitchen Area', name: 'Black Tray', expectedQuantity: 1 },
  { id: 'k7', category: 'Kitchen Area', name: 'White Tray', expectedQuantity: 1 },
  { id: 'k8', category: 'Kitchen Area', name: 'Knife set', expectedQuantity: 5 },
  { id: 'k9', category: 'Kitchen Area', name: 'Cutlery (Tablespoons/Forks/Knives/Teaspoons)', expectedQuantity: 6 },
  { id: 'k10', category: 'Kitchen Area', name: 'Scissors', expectedQuantity: 1 },
  { id: 'k11', category: 'Kitchen Area', name: 'Ladle set', expectedQuantity: 11 },
  { id: 'k12', category: 'Kitchen Area', name: 'Glasses', expectedQuantity: 4 },
  { id: 'k13', category: 'Kitchen Area', name: 'Wine glasses', expectedQuantity: 2 },
  { id: 'k14', category: 'Kitchen Area', name: 'Mugs', expectedQuantity: 2 },
  { id: 'k15', category: 'Kitchen Area', name: 'Blue Fruit Bowl', expectedQuantity: 1 },
  { id: 'k16', category: 'Kitchen Area', name: 'Big Plates', expectedQuantity: 4 },
  { id: 'k17', category: 'Kitchen Area', name: 'Bowls', expectedQuantity: 4 },
  { id: 'k18', category: 'Kitchen Area', name: 'Small plates', expectedQuantity: 2 },
  { id: 'k19', category: 'Kitchen Area', name: 'Cutting board', expectedQuantity: 1 },
  { id: 'k20', category: 'Kitchen Area', name: 'Napkin', expectedQuantity: 1 },
  { id: 'k21', category: 'Kitchen Area', name: 'Big size pots', expectedQuantity: 2 },
  { id: 'k22', category: 'Kitchen Area', name: 'Medium size pot', expectedQuantity: 2 },
  { id: 'k23', category: 'Kitchen Area', name: 'Small size pot', expectedQuantity: 1 },
  { id: 'k24', category: 'Kitchen Area', name: 'Frying pan', expectedQuantity: 1 },
  { id: 'k25', category: 'Kitchen Area', name: 'Trash Can', expectedQuantity: 1 },
  { id: 'k26', category: 'Kitchen Area', name: 'Dustpan w/ brush', expectedQuantity: 1 },

  // Living Room / Room
  { id: 'l1', category: 'Living Room / Room', name: 'Blue Vases', expectedQuantity: 2 },
  { id: 'l2', category: 'Living Room / Room', name: 'Blue Pillow', expectedQuantity: 1 },
  { id: 'l3', category: 'Living Room / Room', name: 'Ironing Board', expectedQuantity: 1 },
  { id: 'l4', category: 'Living Room / Room', name: 'Iron', expectedQuantity: 1 },
  { id: 'l5', category: 'Living Room / Room', name: 'Picture Frame', expectedQuantity: 3 },
  { id: 'l6', category: 'Living Room / Room', name: 'Pillows on bed', expectedQuantity: 4 },
  { id: 'l7', category: 'Living Room / Room', name: 'Decorative pillow on bed', expectedQuantity: 1 },
  { id: 'l8', category: 'Living Room / Room', name: 'TV Remote', expectedQuantity: 2 },
  { id: 'l9', category: 'Living Room / Room', name: 'A/C Remote', expectedQuantity: 1 },

  // Bathroom
  { id: 'b1', category: 'Bathroom', name: 'Hand Soap Dispenser', expectedQuantity: 1 },
  { id: 'b2', category: 'Bathroom', name: 'Toothbrush Holder', expectedQuantity: 1 },
  { id: 'b3', category: 'Bathroom', name: 'Bath Rug', expectedQuantity: 1 },
  { id: 'b4', category: 'Bathroom', name: 'Bath Towel', expectedQuantity: 1 },
  { id: 'b5', category: 'Bathroom', name: 'Hand towel', expectedQuantity: 1 },
  { id: 'b6', category: 'Bathroom', name: 'Soap dish', expectedQuantity: 1 }
];

interface IncomingReservationsDeskProps {
  bookings: Booking[];
  properties: Property[];
  onRefresh: () => void;
  currentUserRole?: 'receptionist' | 'manager' | 'admin';
  currentUserName?: string;
  permissions?: StaffPermissions;
  selectedVertical?: VerticalType;
}

export const IncomingReservationsDesk: React.FC<IncomingReservationsDeskProps> = ({
  bookings,
  properties,
  onRefresh,
  currentUserRole = 'receptionist',
  currentUserName = 'Staff Member',
  permissions,
  selectedVertical = 'stays'
}) => {
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check-Out Inspection Modal State
  const [inspectionTarget, setInspectionTarget] = useState<Booking | null>(null);
  const [inspectionCategoryFilter, setInspectionCategoryFilter] = useState<'All' | 'Kitchen Area' | 'Living Room / Room' | 'Bathroom'>('All');
  const [inventoryChecks, setInventoryChecks] = useState<{ [id: string]: { isIntact: boolean; notes: string } }>({});
  const [overallInspectionNotes, setOverallInspectionNotes] = useState('');
  const [estimatedPenalty, setEstimatedPenalty] = useState<number>(0);

  // Vertical Filtering
  const filteredProperties = properties.filter(p => p.vertical === selectedVertical || (!p.vertical && selectedVertical === 'stays'));
  const filteredBookings = bookings.filter(b => {
    const propVertical = b.property?.vertical || 'stays';
    return propVertical === selectedVertical;
  });

  // Evaluate permissions based on role & staff permissions object
  const canDeleteBookings = currentUserRole !== 'receptionist' || permissions?.can_delete_bookings === true;
  const canRegisterWalkins = permissions?.can_register_walkins !== false;
  const canCheckoutGuests = permissions?.can_checkout_guests !== false;
  const canEditStatus = permissions?.can_edit_booking_status !== false;

  // Walk-in / Short-Time Form State
  const [bookingCategory, setBookingCategory] = useState<'overnight' | 'short_time'>('short_time');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(new Date().toISOString().split('T')[0]);
  const [shortTimeHours, setShortTimeHours] = useState(4);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('18:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [agreedPrice, setAgreedPrice] = useState(120);
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');

  // Keep selectedPropertyId synchronized with available properties
  React.useEffect(() => {
    if (properties.length > 0 && (!selectedPropertyId || !properties.some(p => p.id === selectedPropertyId))) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  // Gentle backup poll for incoming bookings
  React.useEffect(() => {
    const syncInterval = setInterval(() => {
      onRefresh();
    }, 15000);
    return () => clearInterval(syncInterval);
  }, [onRefresh]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const target = bookings.find(b => b.id === bookingId);
      await dataService.checkInGuest(bookingId);
      triggerToast(`Guest check-in recorded for reservation #${bookingId}! SMS & Email dispatched to ${target?.guest_phone || 'client'}.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error processing check-in');
    }
  };

  const handleConfirmPayment = async (bookingId: string) => {
    try {
      const target = bookings.find(b => b.id === bookingId);
      await dataService.confirmBookingPayment(bookingId);
      triggerToast(`Manual payment confirmed & voucher dispatched for booking #${bookingId}! Client: ${target?.guest_name || 'Guest'}.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error confirming payment');
    }
  };

  const openCheckOutInspection = (booking: Booking) => {
    if (!canCheckoutGuests) {
      alert('You do not have authorization to check out guests. Please contact a manager.');
      return;
    }
    // Pre-populate inventory checks: ALL 41 items checked intact by default
    const initialChecks: { [id: string]: { isIntact: boolean; notes: string } } = {};
    DEFAULT_INVENTORY_ITEMS.forEach(item => {
      initialChecks[item.id] = { isIntact: true, notes: '' };
    });
    setInventoryChecks(initialChecks);
    setOverallInspectionNotes('');
    setEstimatedPenalty(0);
    setInspectionCategoryFilter('All');
    setInspectionTarget(booking);
  };

  const handleConfirmCheckOutInspection = async () => {
    if (!inspectionTarget) return;

    // Identify any unchecked (missing or broken) items
    const missingOrDamaged: Array<{ item_name: string; category: string; expected_qty: number; notes?: string }> = [];

    DEFAULT_INVENTORY_ITEMS.forEach(item => {
      const check = inventoryChecks[item.id];
      if (check && !check.isIntact) {
        missingOrDamaged.push({
          item_name: item.name,
          category: item.category,
          expected_qty: item.expectedQuantity,
          notes: check.notes || 'Unchecked during receptionist check-out inspection.'
        });
      }
    });

    try {
      // 1. If any items were missing or broken, file an Incident Report to Admin Audit Portal
      if (missingOrDamaged.length > 0) {
        await dataService.createIncidentReport({
          booking_id: inspectionTarget.id,
          guest_name: inspectionTarget.guest_name,
          guest_phone: inspectionTarget.guest_phone,
          property_title: inspectionTarget.property?.title || 'Silicon Heights Luxury Suite',
          inspected_by_name: currentUserName || 'Reception Staff',
          inspected_by_role: currentUserRole || 'receptionist',
          missing_or_damaged_items: missingOrDamaged,
          overall_notes: overallInspectionNotes,
          estimated_penalty: estimatedPenalty
        });
      }

      // 2. Perform checkout
      await dataService.checkOutGuest(inspectionTarget.id);

      if (missingOrDamaged.length > 0) {
        triggerToast(`Check-Out completed! ${missingOrDamaged.length} damaged/missing item(s) logged to Admin Audit Portal.`);
      } else {
        triggerToast(`Check-Out completed! All 41 inventory items verified intact & complete.`);
      }

      setInspectionTarget(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error processing check-out inspection');
    }
  };

  const handleCheckOut = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      openCheckOutInspection(target);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'upcoming' | 'active' | 'completed' | 'cancelled') => {
    if (!canEditStatus) {
      alert('Your account permission does not allow status modifications.');
      return;
    }
    if (newStatus === 'completed') {
      const target = bookings.find(b => b.id === bookingId);
      if (target) {
        openCheckOutInspection(target);
        return;
      }
    }
    try {
      await dataService.updateBookingStatus(bookingId, newStatus);
      triggerToast(`Status for reservation #${bookingId} updated to ${newStatus.toUpperCase()}. Notification dispatched.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    const creatorName = target.created_by_name?.toLowerCase().trim();
    const currentName = currentUserName?.toLowerCase().trim();
    const isCreator = Boolean(creatorName && currentName && (creatorName === currentName || currentName.includes(creatorName) || creatorName.includes(currentName)));
    const isAdmin = currentUserRole === 'admin';

    if (!isAdmin && !isCreator) {
      alert(`Permission Denied: Reservation #${bookingId} was created by "${target.created_by_name || 'another staff member'}". You cannot delete it — you can only confirm Check-In and Check-Out.`);
      return;
    }

    if (window.confirm(`Are you sure you want to cancel and remove booking ${bookingId}?`)) {
      try {
        await dataService.deleteBooking(bookingId);
        triggerToast(`Booking #${bookingId} deleted.`);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Error deleting booking');
      }
    }
  };

  const handleShortTimeHoursChange = (hours: number) => {
    setShortTimeHours(hours);
    const selectedProp = properties.find(p => p.id === (selectedPropertyId || properties[0]?.id));
    const baseNightPrice = selectedProp ? selectedProp.price_per_night : 200;
    
    if (hours === 2) setAgreedPrice(Math.round(baseNightPrice * 0.35));
    else if (hours === 4) setAgreedPrice(Math.round(baseNightPrice * 0.50));
    else if (hours === 6) setAgreedPrice(Math.round(baseNightPrice * 0.65));
    else setAgreedPrice(Math.round(baseNightPrice * 0.80));

    const [h, m] = checkInTime.split(':').map(Number);
    const outH = (h + hours) % 24;
    setCheckOutTime(`${outH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };

  const handleRegisterBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const propId = selectedPropertyId || (properties[0]?.id || '');
    if (!propId) {
      setErrorMessage('Please select a residence or vehicle.');
      return;
    }
    try {
      await dataService.createWalkInBooking({
        propertyId: propId,
        guest_name: guestName,
        guest_email: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
        guest_phone: guestPhone,
        checkIn: checkInDate,
        checkOut: bookingCategory === 'short_time' ? checkInDate : checkOutDate,
        guests: guestsCount,
        totalPrice: agreedPrice,
        special_requests: specialNotes || (bookingCategory === 'short_time' ? `Short-time stay (${shortTimeHours} Hours)` : 'Walk-in desk booking.'),
        payment_status: paymentStatus,
        booking_category: bookingCategory,
        short_time_hours: bookingCategory === 'short_time' ? shortTimeHours : undefined,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        created_by_role: currentUserRole,
        created_by_name: currentUserName
      });
      setShowWalkInModal(false);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      triggerToast(`Walk-in reservation created! Confirmation SMS & Email dispatched.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error recording walk-in booking');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Notification Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-white hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-navy-950">
              {selectedVertical === 'cars' ? 'Incoming Fleet Rentals & Vehicle Dispatch Desk' :
               selectedVertical === 'experiences' ? 'Incoming Experience & Concierge Tour Desk' :
               'Incoming Reservations & Check-In Desk'}
            </h3>
            <p className="text-xs text-gray-500">
              {selectedVertical === 'cars' ? 'Manage fleet dispatches, vehicle pick-ups, drop-offs, and driver assignments' :
               selectedVertical === 'experiences' ? 'Manage tour bookings, concierge experience slots, and group headcounts' :
               'Manage check-ins, check-outs, reservation status, and guest follow-up'}
            </p>
          </div>
          {canRegisterWalkins && (
            <button
              onClick={() => {
                if (filteredProperties.length > 0) setSelectedPropertyId(filteredProperties[0].id);
                setShowWalkInModal(true);
              }}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              {selectedVertical === 'cars' ? <Car className="w-4 h-4 text-emerald-600" /> :
               selectedVertical === 'experiences' ? <Sparkles className="w-4 h-4 text-emerald-600" /> :
               <UserCheck className="w-4 h-4 text-emerald-600" />}
              <span>
                {selectedVertical === 'cars' ? 'New Car Rental Dispatch' :
                 selectedVertical === 'experiences' ? 'New Tour Booking' :
                 'New Walk-in Guest'}
              </span>
            </button>
          )}
        </div>

        {/* Mobile & Tablet Card View (block lg:hidden) */}
        <div className="block lg:hidden space-y-4 px-4 pb-6">
          {filteredBookings.map((b) => {
            const cleanPhone = b.guest_phone ? b.guest_phone.replace(/[^0-9]/g, '') : '';
            const waText = encodeURIComponent(`Hello ${b.guest_name}, this is Reetay Apartments Concierge regarding your reservation ${b.id} for ${b.property?.title || 'your reservation'}.`);
            const isCheckedIn = b.arrival_status === 'checked_in' || b.status === 'active';
            const isCheckedOut = b.arrival_status === 'checked_out' || b.status === 'completed';
            const isShortTime = b.booking_category === 'short_time';

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 ${
                  isCheckedIn ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-purple-100 shadow-sm'
                }`}
              >
                {/* Header: Ref, Type Badge & Creator */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-gold-600 text-xs">{b.id}</span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isShortTime ? 'bg-purple-100 text-purple-700' :
                      b.booking_type === 'walk_in' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isShortTime ? `Short-Time (${b.short_time_hours}h)` : b.booking_type === 'walk_in' ? 'Walk-In Desk' : 'Online Booking'}
                    </span>
                  </div>

                  {b.created_by_name && (
                    <span className="text-[10px] text-purple-900 font-extrabold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      By: {b.created_by_name}
                    </span>
                  )}
                </div>

                {/* Guest Contact & Residence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Guest Details</span>
                    <button
                      type="button"
                      onClick={() => setSelectedBookingDetails(b)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-xs transition-all cursor-pointer active:scale-95 group"
                    >
                      <Eye className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
                      <span>View Details</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Residence / Vehicle</span>
                    <span className="font-extrabold text-navy-950 text-xs">{b.property?.title || 'Luxury Stay'}</span>
                  </div>
                </div>

                {/* Dates & Amount */}
                <div className="flex flex-wrap items-center justify-between text-xs bg-purple-50/40 p-3 rounded-2xl border border-purple-100 gap-2">
                  <div>
                    <span className="text-[10px] text-purple-900 font-bold block uppercase">Dates & Schedule</span>
                    <span className="font-bold text-navy-950">{b.check_in} &rarr; {b.check_out}</span>
                    <span className="block text-[10px] text-gray-500 font-medium">
                      {b.check_in_time && `In: ${b.check_in_time}`} {b.check_out_time && `• Out: ${b.check_out_time}`} ({b.guests} Guests)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Amount</span>
                    <span className="text-sm font-black text-navy-950">{b.currency || '$'}{b.total_price}</span>
                    <span className={`block text-[10px] uppercase font-black ${b.payment_status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {b.payment_status === 'pending' ? 'Pending Payment' : 'Paid'}
                    </span>
                    {b.payment_status === 'pending' && (
                      <button
                        onClick={() => handleConfirmPayment(b.id)}
                        className="mt-1 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1 active:scale-95 transition-all ml-auto"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-200" />
                        <span>Confirm Payment</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Reservation Status</label>
                  <select
                    value={b.status}
                    disabled={!canEditStatus || isCheckedOut || b.status === 'cancelled'}
                    onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                    className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-extrabold text-navy-950 outline-none cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!isCheckedIn && !isCheckedOut && <option value="upcoming">Waiting Arrival</option>}
                    {!isCheckedOut && <option value="active">Checked In (Active)</option>}
                    <option value="completed">Checked Out (Completed)</option>
                    <option value="cancelled">Cancelled (Unlock Dates)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View Table (hidden lg:block) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
              <tr>
                <th className="p-4 min-w-[130px]">Ref & Type</th>
                <th className="p-4 min-w-[150px]">Guest Contact Info</th>
                <th className="p-4 min-w-[180px]">Residence / Vehicle</th>
                <th className="p-4 min-w-[170px]">Stay Dates & Times</th>
                <th className="p-4 min-w-[100px]">Amount</th>
                <th className="p-4 min-w-[200px]">Arrival & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
              {filteredBookings.map((b) => {
                const cleanPhone = b.guest_phone ? b.guest_phone.replace(/[^0-9]/g, '') : '';
                const isCheckedIn = b.arrival_status === 'checked_in' || b.status === 'active';
                const isCheckedOut = b.arrival_status === 'checked_out' || b.status === 'completed';
                const isShortTime = b.booking_category === 'short_time';

                return (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* REF & TYPE */}
                    <td className="p-4">
                      <span className="font-mono font-black text-gold-600 block">{b.id}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        isShortTime ? 'bg-purple-100 text-purple-700' :
                        b.booking_type === 'walk_in' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isShortTime ? `Short-Time (${b.short_time_hours}h)` : b.booking_type === 'walk_in' ? 'Walk-In Desk' : 'Online Booking'}
                      </span>
                      {b.created_by_name && (
                        <div className="text-[10px] text-gray-500 font-bold mt-1 leading-tight truncate max-w-[150px]" title={`Registered by ${b.created_by_name}`}>
                          <span className="text-gray-400 font-medium">By: </span>
                          <span className="text-purple-900 font-black">{b.created_by_name}</span>
                        </div>
                      )}
                    </td>

                    {/* GUEST CONTACT INFO */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingDetails(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-xs transition-all cursor-pointer shadow-sm active:scale-95 group"
                        title="Click to View Full Guest Details & Contact Dossier"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-700 group-hover:scale-110 transition-transform" />
                        <span>View Details</span>
                      </button>
                    </td>

                    {/* RESIDENCE / VEHICLE */}
                    <td className="p-4 font-extrabold text-navy-950 max-w-[200px] truncate">
                      {b.property?.title || 'Luxury Stay'}
                    </td>

                    {/* STAY DATES & TIMES */}
                    <td className="p-4">
                      <span className="font-bold">{b.check_in} &rarr; {b.check_out}</span>
                      <span className="block text-[10px] text-gray-400 font-medium mt-0.5">
                        {b.check_in_time && `In: ${b.check_in_time}`} {b.check_out_time && `• Out: ${b.check_out_time}`} ({b.guests} Guests)
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 font-black">
                      {b.currency || '$'}{b.total_price}
                      <span className={`block text-[10px] uppercase font-black ${b.payment_status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {b.payment_status === 'pending' ? 'Pending Payment' : 'Paid'}
                      </span>
                      {b.payment_status === 'pending' && (
                        <button
                          onClick={() => handleConfirmPayment(b.id)}
                          className="mt-1 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-200" />
                          <span>Confirm Payment</span>
                        </button>
                      )}
                    </td>

                    {/* ARRIVAL & STATUS */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCheckedIn ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          isCheckedOut ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          b.status === 'cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isCheckedIn ? 'Checked In' : isCheckedOut ? 'Checked Out' : b.status === 'cancelled' ? 'Cancelled' : 'Waiting Arrival'}
                        </span>
                      </div>

                      <select
                        value={b.status}
                        disabled={!canEditStatus || isCheckedOut || b.status === 'cancelled'}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-navy-950 outline-none cursor-pointer min-w-[150px] max-w-[170px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed truncate"
                      >
                        {!isCheckedIn && !isCheckedOut && <option value="upcoming">Waiting Arrival</option>}
                        {!isCheckedOut && <option value="active">Checked In (Active)</option>}
                        <option value="completed">Checked Out (Completed)</option>
                        <option value="cancelled">Cancelled (Unlock Dates)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Guest Details & Contact Dossier */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-purple-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#2E0854] flex items-center justify-center font-bold text-sm">
                  {selectedBookingDetails.guest_name ? selectedBookingDetails.guest_name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <h3 className="font-extrabold text-navy-950 text-base">{selectedBookingDetails.guest_name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium font-mono">Ref: #{selectedBookingDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Contact Row */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${selectedBookingDetails.guest_phone || ''}`}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex flex-col items-center justify-center text-center transition-all group"
              >
                <Phone className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black text-emerald-900">Call Phone</span>
              </a>

              <a
                href={`https://wa.me/${selectedBookingDetails.guest_phone ? selectedBookingDetails.guest_phone.replace(/[^0-9]/g, '') : ''}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 flex flex-col items-center justify-center text-center transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black text-teal-900">WhatsApp</span>
              </a>

              <a
                href={`mailto:${selectedBookingDetails.guest_email || ''}?subject=Reetay%20Properties%20Reservation%20${selectedBookingDetails.id}`}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 flex flex-col items-center justify-center text-center transition-all group"
              >
                <Mail className="w-5 h-5 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black text-purple-950">Send Email</span>
              </a>
            </div>

            {/* Guest Details Cards */}
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Contact Information</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="font-bold text-navy-950 font-mono text-[11px]">{selectedBookingDetails.guest_email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="font-bold text-emerald-700 font-mono text-[11px]">{selectedBookingDetails.guest_phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Special Requests & Notes</h4>
                <p className="text-navy-950 font-bold italic text-xs">
                  "{selectedBookingDetails.special_requests || 'No special requests recorded for this reservation.'}"
                </p>
              </div>

              {/* Stay & Payment Overview */}
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-purple-900 tracking-wider">Reservation Overview</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] block">Residence / Vehicle:</span>
                    <span className="font-extrabold text-navy-950">{selectedBookingDetails.property?.title || 'Luxury Stay'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Stay Category:</span>
                    <span className="font-extrabold text-purple-900 capitalize">
                      {selectedBookingDetails.booking_category === 'short_time'
                        ? `Short-Time Stay (${selectedBookingDetails.short_time_hours || 4}h)`
                        : 'Overnight Stay'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Check-In / Out Dates:</span>
                    <span className="font-bold text-navy-950">{selectedBookingDetails.check_in} &rarr; {selectedBookingDetails.check_out}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Total Amount:</span>
                    <span className="font-black text-navy-950">{selectedBookingDetails.currency || '$'}{selectedBookingDetails.total_price} ({selectedBookingDetails.payment_status || 'paid'})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedBookingDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-black text-white text-xs font-extrabold shadow-md transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Check-Out Inventory Inspection (41 Items Checklist) */}
      {inspectionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 border border-purple-100 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase">
                  <CheckSquare className="w-3.5 h-3.5 text-purple-700" />
                  <span>Mandatory Check-Out Inspection</span>
                </div>
                <h3 className="font-black text-navy-950 text-base sm:text-lg">
                  Inventory Inspection Checklist
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Residence: <strong className="text-navy-950">{inspectionTarget.property?.title || 'Silicon Heights Luxury Suite'}</strong> | Guest: <strong className="text-purple-900">{inspectionTarget.guest_name}</strong> (#{inspectionTarget.id})
                </p>
              </div>

              <button
                onClick={() => setInspectionTarget(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Inspect room items before completing check-out.</p>
                <p className="text-[11px] text-amber-800 font-medium">
                  By default all items are marked intact. <strong>Uncheck any missing or broken item</strong> — it will be recorded into the Admin Damaged/Missing Portal.
                </p>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-2xl">
              {(['All', 'Kitchen Area', 'Living Room / Room', 'Bathroom'] as const).map((cat) => {
                const count = cat === 'All'
                  ? DEFAULT_INVENTORY_ITEMS.length
                  : DEFAULT_INVENTORY_ITEMS.filter(i => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setInspectionCategoryFilter(cat)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap ${
                      inspectionCategoryFilter === cat
                        ? 'bg-purple-950 text-white shadow-sm'
                        : 'text-gray-600 hover:text-navy-950'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Tickable Inventory Checklist */}
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {DEFAULT_INVENTORY_ITEMS.filter(item => inspectionCategoryFilter === 'All' || item.category === inspectionCategoryFilter).map((item) => {
                const check = inventoryChecks[item.id] || { isIntact: true, notes: '' };
                const isChecked = check.isIntact;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      isChecked
                        ? 'bg-emerald-50/40 border-emerald-200/70'
                        : 'bg-rose-50 border-rose-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setInventoryChecks(prev => ({
                              ...prev,
                              [item.id]: { ...check, isIntact: !isChecked }
                            }));
                          }}
                          className={`p-1 rounded-lg transition-transform active:scale-90 ${
                            isChecked ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <p className={`text-xs font-black ${isChecked ? 'text-navy-950' : 'text-rose-950 font-black'}`}>
                            {item.name} <span className="text-[10px] text-gray-500 font-bold">({item.expectedQuantity} x)</span>
                          </p>
                          <span className="text-[10px] text-gray-400 font-semibold">{item.category}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}>
                        {isChecked ? 'Intact & Verified' : 'Missing / Damaged'}
                      </span>
                    </div>

                    {/* Unchecked Item Note Input */}
                    {!isChecked && (
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder={`Specify issue for ${item.name} (e.g. Missing x1, Cracked/Broken handle)...`}
                          value={check.notes}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInventoryChecks(prev => ({
                              ...prev,
                              [item.id]: { ...check, notes: val }
                            }));
                          }}
                          className="w-full text-xs font-bold p-2 rounded-xl bg-white border border-rose-300 text-rose-950 outline-none focus:border-rose-500 shadow-inner"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall Notes & Penalty Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Overall Inspection Comments</label>
                <input
                  type="text"
                  placeholder="Optional comments for admin record..."
                  value={overallInspectionNotes}
                  onChange={(e) => setOverallInspectionNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-navy-950 outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Estimated Damage Charge / Penalty ($)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={estimatedPenalty || ''}
                  onChange={(e) => setEstimatedPenalty(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-emerald-700 outline-none text-xs"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={() => setInspectionTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all"
              >
                Cancel Inspection
              </button>

              <button
                type="button"
                onClick={handleConfirmCheckOutInspection}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Complete Check-Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Walk-in / Short-Time Booking */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-navy-950 text-base">Record Walk-in Reservation</h3>
              </div>
              <button onClick={() => setShowWalkInModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterBooking} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Stay Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingCategory('short_time')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      bookingCategory === 'short_time' ? 'bg-purple-900 text-white border-purple-900' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>Short-Time Stay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingCategory('overnight')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      bookingCategory === 'overnight' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <Bed className="w-4 h-4 text-gold-400" />
                    <span>Overnight Stay</span>
                  </button>
                </div>
              </div>

              {/* Residence / Vehicle Select */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Residence / Fleet Item</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => {
                    setSelectedPropertyId(e.target.value);
                    if (bookingCategory === 'short_time') handleShortTimeHoursChange(shortTimeHours);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-navy-950 outline-none"
                  required
                >
                  {filteredProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} — ${p.price_per_night}/{selectedVertical === 'cars' ? 'day' : 'night'} ({p.location.area})
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Kwame Bediako"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. +233 24 555 7777"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
              </div>

              {bookingCategory === 'short_time' && (
                <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-3">
                  <label className="text-[10px] uppercase font-bold text-purple-900 block">Short-Time Hourly Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 4, 6, 8].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => handleShortTimeHoursChange(hours)}
                        className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                          shortTimeHours === hours ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-purple-900 border border-purple-200'
                        }`}
                      >
                        {hours} Hours
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block">Check-In Time</span>
                      <input
                        type="time"
                        value={checkInTime}
                        onChange={(e) => {
                          setCheckInTime(e.target.value);
                          handleShortTimeHoursChange(shortTimeHours);
                        }}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 font-bold text-navy-950 w-full"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block">Expected Check-Out Time</span>
                      <input
                        type="time"
                        value={checkOutTime}
                        readOnly
                        className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 font-bold text-navy-950 w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    disabled={bookingCategory === 'short_time'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Price & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guests Count</label>
                  <input
                    type="number"
                    min={1}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Agreed Price ($)</label>
                  <input
                    type="number"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Special Notes / Reception Request</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Requested VIP Kotoka Airport pickup on arrival..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-navy-950 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Walk-in & Lock Front-End Calendar</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <BookingDetailsModal
          booking={selectedBookingDetails}
          isOpen={Boolean(selectedBookingDetails)}
          onClose={() => setSelectedBookingDetails(null)}
          onConfirmPayment={async (id) => {
            await handleConfirmPayment(id);
            setSelectedBookingDetails(null);
          }}
        />
      )}
    </div>
  );
};
