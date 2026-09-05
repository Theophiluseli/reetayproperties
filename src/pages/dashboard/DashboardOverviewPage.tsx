import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  MessageSquare,
  User as UserIcon,
  Settings,
  HelpCircle,
  Package,
  Calendar,
  TrendingUp,
  CheckCircle,
  Bed,
  Star,
  Heart,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { EmptyState } from '../../components/common/EmptyState';
import { dataService } from '../../lib/supabase';
import { useRealtimeSync } from '../../lib/realtimeSync';
import { Booking, Conversation, Review, Property, User } from '../../types';

import { BookingDetailsModal } from '../../components/dashboard/BookingDetailsModal';

interface DashboardOverviewPageProps {
  user: User | null;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({ user }) => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useRealtimeSync(['properties', 'bookings', 'reviews', 'favorites'], () => {
    loadDashboardData();
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const b = await dataService.getBookings();
    const c = await dataService.getConversations();
    const r = await dataService.getReviews();
    const f = await dataService.getFavorites();

    setBookings(b);
    setConversations(c);
    setReviews(r);
    setFavorites(f);
    setLoading(false);
  };

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'David';

  const upcomingCount = bookings.filter(b => b.status === 'upcoming').length;
  const activeCount = bookings.filter(b => b.status === 'active').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-[#1E293B] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Member Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-gray-300 font-light max-w-xl">
            Manage your Current Bookings, Previous Bookings, Add New Bookings, My Reviews, and Contact & Support.
          </p>
        </div>
      </div>

      {/* Quick Action Row (5 Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QuickActionCard
            icon={Plus}
            label="Add New Booking"
            to="/"
            primary
          />
          <QuickActionCard
            icon={Calendar}
            label="Current Bookings"
            to="/dashboard/bookings?tab=current"
          />
          <QuickActionCard
            icon={CheckCircle}
            label="Previous Bookings"
            to="/dashboard/bookings?tab=previous"
          />
          <QuickActionCard
            icon={Star}
            label="My Reviews"
            to="/dashboard/reviews"
          />
          <QuickActionCard
            icon={HelpCircle}
            label="Contact & Support"
            to="/dashboard/support"
          />
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Booking Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Calendar}
            value={upcomingCount + activeCount}
            label="Current Bookings"
            caption="Active & upcoming stays"
            badgeColor="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={CheckCircle}
            value={completedCount}
            label="Previous Bookings"
            caption="Completed past stays"
            badgeColor="bg-purple-50 text-purple-600"
          />
          <StatCard
            icon={Package}
            value={bookings.length}
            label="Total Bookings"
            caption="All-time reservations"
            badgeColor="bg-blue-50 text-blue-600"
          />
        </div>
      </div>

      {/* Recent Bookings Panel */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-extrabold text-navy-950">Recent Bookings</h3>
          <Link
            to="/dashboard/bookings"
            className="text-xs font-extrabold text-gold-600 hover:underline flex items-center gap-1"
          >
            <span>See All Bookings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowModal(true);
                }}
                className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-900 tracking-wider">Ref: {booking.id}</span>
                    <h4 className="text-sm font-extrabold text-navy-950 group-hover:text-purple-900 transition-colors">{booking.property.title}</h4>
                    <p className="text-xs text-gray-500">{booking.check_in} &rarr; {booking.check_out} • {booking.guests} Guests</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <span className="text-base font-black text-navy-950">{booking.currency}{booking.total_price}</span>
                  <span className="text-xs font-bold text-purple-700 group-hover:underline">View Details & Confirmation &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bed}
            headline="No bookings yet"
            helperText="You haven't made any reservations. Explore our handpicked luxury apartments to plan your next stay."
            ctaText="Browse Listings"
            onCtaClick={() => navigate('/')}
          />
        )}
      </div>

      {/* Recent Reviews Panel */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-extrabold text-navy-950">Recent Reviews</h3>
          <Link
            to="/dashboard/reviews"
            className="text-xs font-extrabold text-gold-600 hover:underline flex items-center gap-1"
          >
            <span>See All Reviews</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-navy-950 truncate">{rev.property_title}</span>
                  <div className="flex text-gold-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-light line-clamp-2">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Star}
            headline="No reviews yet"
            helperText="Share your experience after completing your stay."
            ctaText="View Completed Stays"
            onCtaClick={() => navigate('/dashboard/bookings')}
          />
        )}
      </div>

      {/* Booking Details & Invoice Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

    </div>
  );
};
