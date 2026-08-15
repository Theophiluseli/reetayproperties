import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Booking } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { Bed, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getBookings().then((b) => {
      setBookings(b);
      setLoading(false);
    });
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
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
        {(['all', 'upcoming', 'active', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-gray-500 hover:text-navy-950 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400 font-bold uppercase">Loading Bookings...</div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
              <img
                src={b.property.images[0]}
                alt={b.property.title}
                className="w-full md:w-48 h-36 rounded-2xl object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gold-600 tracking-wider">Ref: {b.id}</span>
                    <h3 className="text-base font-extrabold text-navy-950">{b.property.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                    {b.check_in} &rarr; {b.check_out}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" />
                    {b.property.location.area}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">Total Paid:</span>
                    <span className="text-base font-black text-navy-950 ml-1">{b.currency}{b.total_price}</span>
                  </div>
                  <Link
                    to={`/stays/${b.property.id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-gold-600 hover:underline"
                  >
                    <span>View Residence</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
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
    </div>
  );
};
