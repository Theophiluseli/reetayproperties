import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Property, Review } from '../types';
import { dataService, getPropertyLiveStatus } from '../lib/supabase';
import { useRealtimeSync } from '../lib/realtimeSync';
import { LeafletMapView } from '../components/map/LeafletMapView';
import { FeatureIcon } from '../components/common/FeatureIcon';
import { ShareModal } from '../components/common/ShareModal';
import { DualCalendarPicker } from '../components/search/DualCalendarPicker';
import { GuestStepperDropdown } from '../components/search/GuestStepperDropdown';
import {
  Star,
  MapPin,
  Share2,
  Heart,
  Users,
  Bed,
  DoorClosed,
  Bath,
  Lock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  ArrowLeft,
  Clock,
  FileText,
  Grid,
  X,
  Calendar
} from 'lucide-react';

import { CarDetailPage } from './CarDetailPage';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState(false);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  // Booking Form State
  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-14');
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isDateBlocked, setIsDateBlocked] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showGuestsPopover, setShowGuestsPopover] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const totalPrice = (property?.price_per_night || 0) * nights;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateStr;
  };

  const loadPropertyData = () => {
    if (id) {
      dataService.getPropertyById(id).then((p) => {
        if (p) setProperty(p);
        setLoading(false);
      });
      dataService.getReviews().then((revs) => {
        setReviews(revs.filter((r) => r.property_id === id));
      });
      if (checkIn && checkOut) {
        dataService.checkDateOverlap(id, checkIn, checkOut).then((overlap) => {
          setIsDateBlocked(overlap);
        });
      }
    }
  };

  useRealtimeSync(['properties', 'bookings', 'reviews'], () => {
    loadPropertyData();
  });

  useEffect(() => {
    loadPropertyData();
  }, [id, checkIn, checkOut]);

  if (loading || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading Residence Details...</p>
      </div>
    );
  }

  if (property.vertical === 'cars') {
    return <CarDetailPage property={property} />;
  }

  const defaultHouseRules = [
    'Check-in: 14:00',
    'Check-out: 11:00',
    'In case of fire or police emergency, call 191/192 then notify host.',
    'Do not sit, stand, or put pressure on kitchen marble; damages are guest\'s responsibility.',
    'DO NOT iron on the bed or sofa.',
    'Safeguard key cards; lost keys incur replacement fee.',
    'Late Check-out fees apply.',
    'Free internet is for regular usage; premium packages available.'
  ];

  const houseRules = property.house_rules || defaultHouseRules;

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const handleReserve = () => {
    navigate('/checkout', {
      state: {
        property,
        checkIn,
        checkOut,
        guests,
        totalPrice
      }
    });
  };

  const openFullPhotoModal = (index: number = 0) => {
    setModalPhotoIndex(index);
    setShowAllPhotosModal(true);
  };

  const liveStatus = getPropertyLiveStatus(property);

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-20 font-sans">
      
      {/* Top Header Breadcrumbs & Back Button */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-gray-500 gap-2">
          {/* Desktop Full Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 font-medium truncate">
            <Link to="/" className="hover:text-navy-950">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link to="/" className="hover:text-navy-950 uppercase">{property.vertical}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-400">{property.location.area}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-extrabold text-navy-950 truncate max-w-[250px]">{property.title}</span>
          </div>

          {/* Mobile Back Link */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-[#2E0854] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#2E0854]" />
            <span>Back to listings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        
        {/* Title Header & Status Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#2E0854] tracking-tight leading-tight">
              {property.title}
            </h1>

            {/* Live Operational Status Badge */}
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border ${
              liveStatus.status === 'available'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : liveStatus.status === 'occupied'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : liveStatus.status === 'booked'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : liveStatus.status === 'maintenance'
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                liveStatus.status === 'available' ? 'bg-emerald-500 animate-pulse' :
                liveStatus.status === 'occupied' ? 'bg-rose-500' :
                liveStatus.status === 'booked' ? 'bg-amber-500' :
                liveStatus.status === 'maintenance' ? 'bg-purple-600' : 'bg-cyan-500'
              }`} />
              <span>{liveStatus.label}</span>
            </span>

            {property.badge && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-400 text-navy-950 shadow-sm">
                {property.badge}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-1 text-navy-950 font-bold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{property.rating}</span>
              <span className="text-gray-400 font-normal">({property.review_count} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4 text-[#2E0854]" />
              <span>{property.location.address}</span>
            </div>
          </div>
        </div>

        {/* Maintenance / Notice Banner */}
        {liveStatus.status === 'maintenance' && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 text-purple-900 text-xs font-bold animate-in fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse shrink-0"></span>
            <span>Notice: This suite is currently undergoing routine maintenance. Please contact concierge for alternative suites or earliest check-in date.</span>
          </div>
        )}

        {/* Photo Gallery Grid (Optimized Mobile Hero View) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden relative border border-gray-100 shadow-sm">
          
          {/* Main Hero Image */}
          <div
            onClick={() => openFullPhotoModal(0)}
            className="md:col-span-2 h-64 sm:h-80 md:h-[460px] relative overflow-hidden cursor-pointer group bg-gray-100"
          >
            <img
              src={galleryImages[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />

            {/* Mobile Overlay Action Badges */}
            <div className="flex md:hidden absolute top-3 right-3 items-center gap-2 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-navy-950 flex items-center justify-center shadow-md active:scale-95 transition-all"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-navy-950" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-navy-950 flex items-center justify-center shadow-md active:scale-95 transition-all"
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-navy-950'}`} />
              </button>
            </div>

            {/* Mobile Floating Photo Count Badge */}
            <div className="flex md:hidden absolute bottom-3 right-3 items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold shadow-lg z-20">
              <Grid className="w-3.5 h-3.5" />
              <span>1 / {galleryImages.length} Photos</span>
            </div>
          </div>

          {/* Column 2: Middle Stacked 2 Images */}
          <div className="hidden md:flex flex-col gap-3 h-[460px]">
            <div
              onClick={() => openFullPhotoModal(1)}
              className="h-[225px] overflow-hidden relative cursor-pointer group bg-gray-100"
            >
              <img
                src={galleryImages[1] || galleryImages[0]}
                alt={`${property.title} preview 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div
              onClick={() => openFullPhotoModal(2)}
              className="h-[225px] overflow-hidden relative cursor-pointer group bg-gray-100"
            >
              <img
                src={galleryImages[2] || galleryImages[0]}
                alt={`${property.title} preview 3`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Column 3: Right Stacked 2 Images */}
          <div className="hidden md:flex flex-col gap-3 h-[460px] relative">
            
            {/* Top Right Photo with Share & Heart Action Buttons */}
            <div
              onClick={() => openFullPhotoModal(3)}
              className="h-[225px] overflow-hidden relative cursor-pointer group bg-gray-100"
            >
              <img
                src={galleryImages[3] || galleryImages[0]}
                alt={`${property.title} preview 4`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Top-Right Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShareModalOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 text-navy-950 flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-navy-950" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 text-navy-950 flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95"
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-navy-950'}`} />
                </button>
              </div>
            </div>

            {/* Bottom Right Photo with "Show all photos" Button */}
            <div
              onClick={() => openFullPhotoModal(4)}
              className="h-[225px] overflow-hidden relative cursor-pointer group bg-gray-100"
            >
              <img
                src={galleryImages[4] || galleryImages[0]}
                alt={`${property.title} preview 5`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFullPhotoModal(0);
                }}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-navy-950 font-bold text-xs shadow-lg border border-gray-200 flex items-center gap-2 active:scale-95 transition-all z-20"
              >
                <Grid className="w-4 h-4 text-navy-950" />
                <span>Show all photos</span>
              </button>
            </div>

          </div>

        </div>

        {/* Main Details & Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          
          {/* Left Column: Specs, Description, Amenities & House Rules */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Specs (Brand Dark Purple Icons & Single-Line Labels) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-purple-50/50 rounded-3xl border border-purple-100/80 text-center">
              <div className="flex flex-col items-center justify-center p-1.5">
                <Users className="w-5 h-5 text-[#2E0854] mb-1" />
                <span className="text-xs font-black text-navy-950 whitespace-nowrap">{property.max_guests} Guests</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5">
                <DoorClosed className="w-5 h-5 text-[#2E0854] mb-1" />
                <span className="text-xs font-black text-navy-950 whitespace-nowrap">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5">
                <Bed className="w-5 h-5 text-[#2E0854] mb-1" />
                <span className="text-xs font-black text-navy-950 whitespace-nowrap">{property.beds} Beds</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5">
                <Bath className="w-5 h-5 text-[#2E0854] mb-1" />
                <span className="text-xs font-black text-navy-950 whitespace-nowrap">{property.bathrooms} Baths</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-navy-950">About this stay</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid (Clean Single Badge Rendering) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-extrabold text-navy-950">Amenities</h3>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {property.amenities.map((amenity) => (
                  <FeatureIcon key={amenity} name={amenity} size="md" />
                ))}
              </div>
            </div>

            {/* House Rules Section */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-extrabold text-navy-950">House Rules</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {houseRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700 font-medium">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-extrabold text-navy-950">Location</h3>
              <p className="text-xs text-gray-500">{property.location.address}</p>
              <LeafletMapView properties={[property]} height="350px" />
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-5">
              
              {/* Header Price (Matching Screenshot) */}
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-[#2E0854]">${totalPrice.toFixed(0)}</span>
                  <span className="text-sm font-semibold text-gray-500">total</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">Includes taxes and fees where applicable</p>
              </div>

              {/* Check-in / Check-out & Guests Grid (Matching Screenshot) */}
              <div className="space-y-2.5 relative">
                {/* Check-in / Check-out Grid */}
                <div 
                  onClick={() => {
                    setShowCalendarModal(!showCalendarModal);
                    setShowGuestsPopover(false);
                  }}
                  className="grid grid-cols-2 gap-2 cursor-pointer"
                >
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-navy-950 transition-all">
                    <label className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider cursor-pointer">
                      CHECK-IN
                    </label>
                    <span className="text-sm font-black text-navy-950 block mt-0.5">
                      {formatDateDisplay(checkIn)}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-navy-950 transition-all">
                    <label className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider cursor-pointer">
                      CHECK-OUT
                    </label>
                    <span className="text-sm font-black text-navy-950 block mt-0.5">
                      {formatDateDisplay(checkOut)}
                    </span>
                  </div>
                </div>

                {/* Calendar Popover */}
                {showCalendarModal && (
                  <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in-95">
                    <DualCalendarPicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelectDates={(inDate, outDate) => {
                        setCheckIn(inDate);
                        if (outDate) setCheckOut(outDate);
                      }}
                      onClose={() => setShowCalendarModal(false)}
                    />
                  </div>
                )}

                {/* Guests Selection Card */}
                <div 
                  onClick={() => {
                    setShowGuestsPopover(!showGuestsPopover);
                    setShowCalendarModal(false);
                  }}
                  className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-navy-950 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider cursor-pointer">
                      GUESTS
                    </label>
                    <span className="text-sm font-black text-navy-950 block mt-0.5">
                      {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>

                {/* Guests Popover */}
                {showGuestsPopover && (
                  <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in-95 w-full">
                    <GuestStepperDropdown
                      adults={adults}
                      childrenCount={childrenCount}
                      infants={infants}
                      onChangeAdults={(val) => { setAdults(val); setGuests(val + childrenCount); }}
                      onChangeChildren={(val) => { setChildrenCount(val); setGuests(adults + val); }}
                      onChangeInfants={(val) => setInfants(val)}
                      onClose={() => setShowGuestsPopover(false)}
                    />
                  </div>
                )}
              </div>

              {/* Overlap / Lock Warning */}
              {isDateBlocked && (
                <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-bold animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Selected dates are reserved! Please select another date.</span>
                </div>
              )}

              {/* Offer Info */}
              <div className="border-t border-gray-100 pt-4 space-y-1">
                <p className="text-xs text-gray-500 font-medium">Price includes all applicable taxes and fees.</p>
              </div>

              {/* Total Calculation Row */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-base font-black text-navy-950">Total</span>
                <span className="text-xl font-black text-navy-950">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Reserve Button */}
              <button
                disabled={isDateBlocked}
                onClick={handleReserve}
                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                  isDateBlocked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy-950 hover:bg-black text-white active:scale-98'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isDateBlocked ? 'Dates Locked' : 'Reserve Stay'}</span>
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* Mobile Floating Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-purple-100 p-3.5 px-4 rounded-3xl shadow-2xl transition-all">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#2E0854]">${property.price_per_night}</span>
              <span className="text-xs text-gray-500 font-bold">/ night</span>
            </div>
            <span className="text-[11px] font-extrabold text-gray-400 block mt-0.5 tracking-tight">
              {formatDateDisplay(checkIn)} – {formatDateDisplay(checkOut)}
            </span>
          </div>

          <button
            disabled={isDateBlocked}
            onClick={handleReserve}
            className={`px-5 py-3 rounded-full font-black text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all ${
              isDateBlocked
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#2E0854] hover:bg-black text-white active:scale-95 shadow-purple-950/20'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isDateBlocked ? 'Dates Locked' : 'Reserve Stay'}</span>
          </button>
        </div>
      </div>

      {/* Full Photo Gallery Lightbox Modal */}
      {showAllPhotosModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in">
          <div className="flex items-center justify-between text-white border-b border-gray-800 pb-3">
            <span className="text-sm font-bold">
              Photo {modalPhotoIndex + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setShowAllPhotosModal(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-between gap-4 max-h-[80vh] py-4 relative">
            <button
              onClick={() => setModalPhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={galleryImages[modalPhotoIndex]}
              alt={`Full view ${modalPhotoIndex + 1}`}
              className="max-h-full max-w-full object-contain mx-auto rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setModalPhotoIndex((prev) => (prev + 1) % galleryImages.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                onClick={() => setModalPhotoIndex(idx)}
                className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  idx === modalPhotoIndex ? 'border-amber-500 scale-105' : 'border-transparent opacity-60'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        property={property}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

    </div>
  );
};
