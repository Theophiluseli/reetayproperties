import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { ReetayLogo } from '../common/ReetayLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#18052B] text-gray-300 border-t border-purple-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          
          {/* Column 1: Round Logo & Brand Info */}
          <div className="space-y-2.5 sm:col-span-1 flex flex-col items-center sm:items-start">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <ReetayLogo size="lg" />
            </Link>
            <p className="text-xs text-purple-200/80 leading-relaxed font-normal max-w-xs text-center sm:text-left">
              Luxury short-stay apartments, executive car rentals, and curated African experiences in West Africa.
            </p>
          </div>

          {/* Column 2: Our Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Our Policies</h4>
            <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>How We Ensure Quality</span>
                </a>
              </li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms & Services</a></li>
            </ul>
          </div>

          {/* Column 3: Our Information */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Our Information</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>concierge@reetay.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>+233 24 123 4567</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-2 max-w-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>14 Independence Avenue, Airport Residential, Accra - Ghana</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Short-Stay Apartments</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Executive Car Rentals</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Helicopter & VIP Tours</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Guest Dashboard</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-900/60 mt-8 pt-4 text-center text-[11px] text-gray-400 font-medium">
          © {new Date().getFullYear()} Reetay Apartments Platform. All rights reserved. Designed for Luxury Hospitality.
        </div>
      </div>
    </footer>
  );
};
