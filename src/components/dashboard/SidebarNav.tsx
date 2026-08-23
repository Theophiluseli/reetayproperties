import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  PlusCircle,
  Star,
  HelpCircle,
  LogOut,
  UserCog
} from 'lucide-react';
import { User } from '../../types';

interface SidebarNavProps {
  user: User | null;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ user, onLogout }) => {
  const navSections = [
    {
      title: 'BOOKINGS',
      items: [
        { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Current Bookings', path: '/dashboard/bookings?tab=current', icon: CalendarCheck },
        { label: 'Previous Bookings', path: '/dashboard/bookings?tab=previous', icon: History },
        { label: 'Add New Booking', path: '/', icon: PlusCircle },
      ]
    },
    {
      title: 'HELP & REVIEWS',
      items: [
        { label: 'My Reviews', path: '/dashboard/reviews', icon: Star },
        { label: 'Contact & Support', path: '/dashboard/support', icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 shadow-sm min-h-[calc(100vh-5rem)]">
      
      <div className="space-y-6">
        {/* User Identity Block */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.full_name || 'User'}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-gold-500/40 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-navy-950 truncate">
              {user?.full_name || 'David Reetay'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'david@reetay.com'}</p>
            <NavLink
              to="/dashboard/profile"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-600 hover:text-gold-700 mt-1"
            >
              <UserCog className="w-3 h-3" />
              <span>Edit Profile</span>
            </NavLink>
          </div>
        </div>

        {/* Grouped Nav Sections */}
        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-gray-400 block">
                {section.title}
              </span>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-l-4 ${
                      isActive
                        ? 'bg-gold-50/70 text-navy-950 border-gold-500 shadow-sm'
                        : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-navy-950'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout pinned at bottom */}
      <div className="pt-4 border-t border-gray-100 mt-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};
