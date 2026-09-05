import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../../lib/supabase';
import { useRealtimeSync } from '../../lib/realtimeSync';
import { Booking } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { Bed, Calendar, MapPin, ExternalLink, FileText } from 'lucide-react';
import { BookingDetailsModal } from '../../components/dashboard/BookingDetailsModal';

export const MyBookingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'previous' | 'upcoming' | 'active' | 'completed' | 'cancelled'>(
    tabParam === 'previous' ? 'previous' : tabParam === 'current' ? 'current' : 'all'
  );
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadBookings = () => {
    dataService.getBookings().then((b) => {
      setBookings(b);
      setLoading(false);
    });
  };

  useRealtimeSync(['bookings'], () => {
    loadBookings();
  });

  useEffect(() => {
    if (tabParam === 'previous') setActiveTab('previous');
    else if (tabParam === 'current') setActiveTab('current');
  }, [tabParam]);

  useEffect(() => {
    loadBookings();
  }, []);

  const handleOpenBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'current') return b.status === 'upcoming' || b.status === 'active';
    if (activeTab === 'previous') return b.status === 'completed' || b.status === 'cancelled';
    return b.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">My Bookings & Reservations</h1>
        <p className="text-xs text-gray-500 font-medium">Manage past, active, and upcoming short-stay bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Reservations' },
          { id: 'current', label: 'Current Stays (Active/Upcoming)' },
          { id: 'previous', label: 'Previous Stays (Past/Completed)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchParams({ tab: tab.id });
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-gray-500 hover:text-navy-950 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400 font-bold uppercase">Loading Bookings...</div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => handleOpenBookingDetails(b)}
            >
              <img
                src={b.property.images[0]}
                alt={b.property.title}
                className="w-full md:w-48 h-36 rounded-2xl object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gold-600 tracking-wider">Ref: {b.id}</span>
                    <h3 className="text-base font-extrabold text-navy-950 group-hover:text-purple-900 transition-colors">{b.property.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                    {b.check_in} &rarr; {b.check_out}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" />
                    {b.property.location.area}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">Total Paid:</span>
                    <span className="text-base font-black text-navy-950 ml-1">{b.currency}{b.total_price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBookingDetails(b);
                      }}
                      className="px-4 py-2 rounded-full bg-[#2E0854] hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-gold-400" />
                      <span>Details & Invoice Confirmation</span>
                    </button>
                    <Link
                      to={`/stays/${b.property.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full text-gray-400 hover:text-gold-600 hover:bg-gray-100 transition-colors"
                      title="View Residence"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bed}
          headline={`No ${activeTab !== 'all' ? activeTab : ''} bookings found`}
          helperText="You don't have any bookings matching this status filter."
          ctaText="Explore Stays"
          onCtaClick={() => (window.location.href = '/')}
        />
      )}

      {/* Booking Details & 1-Page Invoice Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
