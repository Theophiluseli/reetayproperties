import React from 'react';
import { Bell, ShieldCheck, Tag } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">Notifications & Preferences</h1>
        <p className="text-xs text-gray-500 font-medium">Alerts, booking updates, and promotional deals</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-navy-950">Recent Notifications</h3>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-navy-950">Booking Confirmed #BK-89021</h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">Your reservation for Grand Penthouse & Skyline Suite is locked in.</p>
              <span className="text-[10px] text-gray-400 mt-1 block">2 hours ago</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-navy-950">Summer Deals Discount Unlocked</h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">Get 15% off executive chauffeur rentals when combined with any 3-night stay.</p>
              <span className="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
