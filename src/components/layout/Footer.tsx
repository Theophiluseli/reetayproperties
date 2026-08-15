import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { ReetayLogo } from '../common/ReetayLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F0438] text-gray-300 border-t border-purple-900 text-center">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-purple-900/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1 flex flex-col items-center text-center">
            <ReetayLogo size="lg" className="text-white mx-auto" />
            <p className="text-xs text-purple-200 leading-relaxed font-light max-w-sm mx-auto">
              Luxury short-stay apartments, bespoke car rentals, and curated African experiences. Redefining high-end hospitality in West Africa.
            </p>
          </div>

          {/* Our Policies */}
          <div className="space-y-3 flex flex-col items-center text-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Our Policies</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium flex flex-col items-center">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> How We Ensure Quality</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Terms & Services</a></li>
            </ul>
          </div>

          {/* Our Information */}
          <div className="space-y-3 flex flex-col items-center text-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Our Information</h4>
            <ul className="space-y-2.5 text-sm text-gray-400 flex flex-col items-center">
              <li className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>concierge@reetay.com</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>+233 24 123 4567</span>
              </li>
              <li className="flex items-center justify-center gap-2 max-w-xs text-center">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>14 Independence Avenue, Airport Residential, Accra - Ghana</span>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-3 flex flex-col items-center text-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium flex flex-col items-center">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Short-Stay Apartments</Link></li>
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Executive Car Rentals</Link></li>
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Helicopter & VIP Tours</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold-400 transition-colors">Guest Dashboard</Link></li>
              <li><Link to="/portal/login" className="hover:text-gold-400 transition-colors text-amber-400 font-bold">Staff Portal (Receptionist / Manager / Admin)</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Reetay Apartments Platform. All rights reserved. Designed for Luxury Hospitality.
      </div>
    </footer>
  );
};
