import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">Support & VIP Concierge</h1>
        <p className="text-xs text-gray-500 font-medium">We are available 24/7 to assist with your stay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">Live Concierge Chat</h3>
          <p className="text-xs text-gray-500 font-light">Instant in-app messaging with host desk</p>
          <Link
            to="/dashboard/messages"
            className="inline-block pt-2 text-xs font-bold text-gold-600 hover:underline"
          >
            Open Chat Desk &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">Direct Hotline</h3>
          <p className="text-xs text-gray-500 font-light">+233 24 123 4567</p>
          <span className="text-[10px] font-bold uppercase text-emerald-600">Available 24/7</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-navy-950">Email Support</h3>
          <p className="text-xs text-gray-500 font-light">concierge@reetay.com</p>
          <span className="text-[10px] text-gray-400">Response within 15 minutes</span>
        </div>

      </div>
    </div>
  );
};
