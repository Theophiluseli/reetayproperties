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
import { Booking, Conversation, Review, Property, User } from '../../types';

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
            Manage your luxury short-stay bookings, messages with VIP concierge, property reviews, and saved favorites.
          </p>
        </div>
      </div>

      {/* Quick Action Row (5 Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QuickActionCard
            icon={Plus}
            label="New Booking"
            to="/"
            primary
          />
          <QuickActionCard
            icon={MessageSquare}
            label="Message Admin"
            to="/dashboard/messages"
          />
          <QuickActionCard
            icon={UserIcon}
            label="My Profile"
            to="/dashboard/profile"
          />
          <QuickActionCard
            icon={Settings}
            label="Preferences"
            to="/dashboard/notifications"
          />
          <QuickActionCard
            icon={HelpCircle}
            label="Support Desk"
            to="/dashboard/support"
          />
        </div>
      </div>

      {/* Stat Cards Row (4 Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Booking Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            value={bookings.length}
            label="Total Bookings"
            caption="All time reservations"
            badgeColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Calendar}
            value={upcomingCount}
            label="Upcoming"
            caption="Next scheduled trips"
            badgeColor="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={TrendingUp}
            value={activeCount}
            label="Active Stays"
            caption="In progress right now"
            badgeColor="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={CheckCircle}
            value={completedCount}
            label="Completed"
            caption="Past successful stays"
            badgeColor="bg-purple-50 text-purple-600"
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
              <div key={booking.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-navy-950">{booking.property.title}</h4>
                    <p className="text-xs text-gray-500">{booking.check_in} &rarr; {booking.check_out} • {booking.guests} Guests</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-navy-950">{booking.currency}{booking.total_price}</span>
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

      {/* Two Side-by-Side Panels: Messages & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Messages Panel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-navy-950">Recent Messages</h3>
            <Link
              to="/dashboard/messages"
              className="text-xs font-extrabold text-gold-600 hover:underline flex items-center gap-1"
            >
              <span>See All Messages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  to="/dashboard/messages"
                  className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 hover:bg-gold-50/50 transition-colors block"
                >
                  <img src={conv.avatar} alt={conv.title} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-xs font-extrabold text-navy-950 truncate">{conv.title}</p>
                      <span className="text-[10px] text-gray-400">{conv.last_message_time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              headline="No messages"
              helperText="Start a conversation with our concierge desk or host regarding your stay."
              ctaText="Send Message"
              onCtaClick={() => navigate('/dashboard/messages')}
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

      </div>

      {/* Recent Favorites Panel (Full Width) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-extrabold text-navy-950">Saved Favorites</h3>
          <Link
            to="/dashboard/favorites"
            className="text-xs font-extrabold text-gold-600 hover:underline flex items-center gap-1"
          >
            <span>See All Favorites</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                to={`/stays/${fav.id}`}
                className="p-3 rounded-2xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow bg-gray-50"
              >
                <img src={fav.images[0]} alt={fav.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-navy-950 truncate">{fav.title}</h4>
                  <p className="text-[11px] text-gray-400 truncate">{fav.location.area}</p>
                  <p className="text-xs font-black text-gold-600 mt-1">{fav.currency}{fav.price_per_night}/night</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            headline="No favorites yet"
            helperText="Click the heart icon on any listing to save properties to your wishlist."
            ctaText="Start Browsing"
            onCtaClick={() => navigate('/')}
          />
        )}
      </div>

    </div>
  );
};
