import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { dataService } from '../lib/supabase';
import { ShareModal } from '../components/common/ShareModal';
import { FeatureIcon } from '../components/common/FeatureIcon';
import { DualCalendarPicker } from '../components/search/DualCalendarPicker';
import {
  Heart,
  Share2,
  MapPin,
  Users,
  Fuel,
  Sliders,
  Calendar,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Grid,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Briefcase,
  DoorClosed,
  Zap,
  ArrowLeft,
  Lock
} from 'lucide-react';

interface CarDetailPageProps {
  property: Property;
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({ property }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState(false);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Reservation form state
  const [pickupLocation, setPickupLocation] = useState(property.pickup_locations?.[0] || 'Accra');
  const [dropoffLocation, setDropoffLocation] = useState(property.dropoff_locations?.[0] || 'Accra');
  const [pickupDate, setPickupDate] = useState('2026-09-10');
  const [returnDate, setReturnDate] = useState('2026-09-14');
  const [pickupTime, setPickupTime] = useState('10:00 AM');

  const calculateRentalDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateRentalDays();
  const totalCarPrice = (property?.price_per_night || 0) * rentalDays;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateStr;
  };

  const [similarCars, setSimilarCars] = useState<Property[]>([]);

  useEffect(() => {
    dataService.getProperties('cars').then((cars) => {
      setSimilarCars(cars.filter((c) => c.id !== property.id).slice(0, 4));
    });
  }, [property.id]);

  const defaultImages = [
    property.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
  ];

  const galleryImages = property.images && property.images.length >= 5
    ? property.images
    : [...property.images, ...defaultImages.slice(property.images.length)].slice(0, 5);

  const availablePickupLocs = property.pickup_locations || ['Accra', 'Kumasi', 'Sunyani', 'Takoradi'];
  const availableDropoffLocs = property.dropoff_locations || ['Cape Coast', 'Ho', 'Wa', 'Sunyani', 'Accra'];

  const handleReserve = () => {
    navigate('/checkout', {
      state: {
        property,
        checkIn: pickupDate,
        checkOut: returnDate,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        guests: property.max_guests,
        totalPrice: property.price_per_night * 4
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8 space-y-8 animate-in fade-in">
      
      {/* Top Breadcrumb & Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1.5">
          {/* Desktop Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-navy-950 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/?vertical=cars" className="hover:text-navy-950 transition-colors">Cars</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-md">{property.title}</span>
          </div>

          <div className="flex items-center gap-3 pt-0.5">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#1D2B44] text-white flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Instant Booking</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-[#2E0854] tracking-tight leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <MapPin className="w-4 h-4 text-[#2E0854]" />
            <span>Available in {property.location.area}, {property.location.city}</span>
          </div>
        </div>

        {/* Top Right Action Links */}
        <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
          <Link
            to="/?vertical=cars"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E0854] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-full bg-white border border-gray-200 text-navy-950 hover:bg-gray-50 shadow-sm transition-all"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full bg-white border border-gray-200 text-navy-950 hover:bg-gray-50 shadow-sm transition-all"
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5-Image Gallery Grid (Optimized Mobile Picture View) */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gray-100 grid grid-cols-1 md:grid-cols-4 gap-2 h-64 sm:h-80 md:h-[420px]">
        {/* Large Hero Main Image */}
        <div
          onClick={() => {
            setModalPhotoIndex(0);
            setShowAllPhotosModal(true);
          }}
          className="md:col-span-2 h-full cursor-pointer overflow-hidden relative group"
        >
          <img
            src={galleryImages[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 4 Small Images in 2x2 Grid */}
        <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
          {galleryImages.slice(1, 5).map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setModalPhotoIndex(idx + 1);
                setShowAllPhotosModal(true);
              }}
              className="relative h-[205px] cursor-pointer overflow-hidden group"
            >
              <img
                src={imgUrl}
                alt={`${property.title} view ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {idx === 3 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllPhotosModal(true);
                  }}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-black text-navy-950 shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-white transition-all"
                >
                  <Grid className="w-4 h-4" />
                  <span>View all photos</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (Content & Specifications) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: About This Car */}
          <div className="space-y-4 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">About this car</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {property.description ||
                `Travel together in comfort with the ${property.title} — a spacious and dependable vehicle designed for group trips, tours, corporate transport, and long-distance journeys. Built for capability and efficiency, it delivers a smooth and stable ride for both city and highway travel. With its generous seating capacity and roomy interior, it is ideal for moving groups comfortably while maintaining reliability and performance.`}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <strong className="text-navy-950 font-bold">Pricing & Information:</strong> Prices listed are starting rates for travel within Accra and do not include fuel. Pricing is subject to availability and may vary depending on the day, season, demand, and the specific year/model of the vehicle. Book now and enjoy a reliable, spacious, and comfortable solution for your journey.
            </p>
          </div>

          {/* Section 2: Vehicle Specifications */}
          <div className="space-y-4 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <Sliders className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Transmission</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">{property.transmission || 'Automatic'}</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <Fuel className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Fuel Type</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">{property.fuel_type || 'Petrol'}</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <DoorClosed className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Doors</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">4 Doors</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <Users className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Seats</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">{property.max_guests} Passengers</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <Briefcase className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Luggage</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">2 Bags</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100/80 shadow-sm space-y-1">
                <Calendar className="w-5 h-5 text-[#2E0854]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Year</span>
                <span className="text-xs sm:text-sm font-extrabold text-navy-950">2022</span>
              </div>
            </div>
          </div>

          {/* Section 3: Features & Amenities */}
          <div className="space-y-4 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">Features & Amenities</h2>
            <p className="text-xs text-gray-500">This vehicle comes equipped with the following features to enhance your journey:</p>
            
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {(property.amenities && property.amenities.length > 0
                ? property.amenities
                : [
                    'GPS Navigation',
                    'Air Conditioning',
                    'Bluetooth Connectivity',
                    'USB / Type-C Charging',
                    'Clean Interior',
                    'Portable WiFi'
                  ]
              ).map((feat, i) => (
                <FeatureIcon key={i} name={feat} size="md" />
              ))}
            </div>
          </div>

          {/* Section 4: Available Pickup Locations */}
          <div className="space-y-4 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">Available Pickup Locations</h2>
            <div className="flex flex-wrap gap-2">
              {availablePickupLocs.map((loc) => (
                <span
                  key={loc}
                  className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-xs font-extrabold text-navy-950 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-navy-950" />
                  <span>{loc}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Pricing Information */}
          <div className="space-y-3 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">Pricing Information</h2>
            <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 text-xs text-navy-950 space-y-1.5 font-medium">
              <p>• Standard daily rental rates apply for 12-hour or 24-hour service blocks.</p>
              <p>• Chauffeur service is available upon request for stress-free travel in Ghana.</p>
              <p>• Long-term multi-day discounts automatically calculate at checkout.</p>
            </div>
          </div>

          {/* Section 6: Rental Terms & Requirements */}
          <div className="space-y-6 border-b border-gray-200 pb-8">
            <h2 className="text-xl font-black text-navy-950">Rental Terms & Requirements</h2>
            
            <div className="space-y-6 text-xs text-gray-700 font-semibold">
              {/* Requirement 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-navy-950">
                  <div className="w-6 h-6 rounded-full bg-navy-950 text-white flex items-center justify-center text-xs">
                    1
                  </div>
                  <h3>Driver Requirements</h3>
                </div>
                <ul className="pl-8 space-y-1 text-gray-600 list-disc">
                  <li>Minimum age 21 years old</li>
                  <li>Valid driver's license required (held for at least 1 year)</li>
                  <li>International driving permit required for non-local license</li>
                </ul>
              </div>

              {/* Requirement 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-navy-950">
                  <div className="w-6 h-6 rounded-full bg-navy-950 text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <h3>Insurance & Damage</h3>
                </div>
                <ul className="pl-8 space-y-1 text-gray-600 list-disc">
                  <li>Basic insurance included in rental price</li>
                  <li>Security deposit required (refunded after inspection)</li>
                  <li>Additional coverage options available at pick-up</li>
                </ul>
              </div>

              {/* Requirement 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-navy-950">
                  <div className="w-6 h-6 rounded-full bg-navy-950 text-white flex items-center justify-center text-xs">
                    3
                  </div>
                  <h3>Important Notes</h3>
                </div>
                <ul className="pl-8 space-y-1 text-gray-600 list-disc">
                  <li>Fuel policy: Return with same level as pick-up</li>
                  <li>Cross-border travel restrictions may apply</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 7: Similar Cars */}
          {similarCars.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-navy-950">Similar Cars</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarCars.map((car) => (
                  <Link
                    key={car.id}
                    to={`/stays/${car.id}`}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="h-36 overflow-hidden relative bg-gray-100">
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-navy-950 text-xs line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {car.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1 font-semibold">
                          <span>👥 {car.max_guests}</span>
                          <span>•</span>
                          <span>⚙️ {car.transmission || 'Automatic'}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Reserve with pricing</span>
                        <span className="text-sm font-black text-navy-950">${car.price_per_night}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column Sticky Booking Widget (Matching User Screenshot) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-5">
            
            {/* Header Price (Matching Screenshot) */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#2E0854]">${totalCarPrice.toFixed(0)}</span>
                <span className="text-sm font-semibold text-gray-500">total</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">Includes taxes and fees where applicable</p>
            </div>

            {/* Check-in / Check-out Grid (Matching Screenshot) */}
            <div className="space-y-2.5 relative">
              <div 
                onClick={() => setShowCalendarModal(!showCalendarModal)}
                className="grid grid-cols-2 gap-2 cursor-pointer"
              >
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-navy-950 transition-all">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider cursor-pointer">
                    CHECK-IN
                  </label>
                  <span className="text-sm font-black text-navy-950 block mt-0.5">
                    {formatDateDisplay(pickupDate)}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-navy-950 transition-all">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider cursor-pointer">
                    CHECK-OUT
                  </label>
                  <span className="text-sm font-black text-navy-950 block mt-0.5">
                    {formatDateDisplay(returnDate)}
                  </span>
                </div>
              </div>

              {/* Calendar Popover */}
              {showCalendarModal && (
                <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in-95">
                  <DualCalendarPicker
                    checkIn={pickupDate}
                    checkOut={returnDate}
                    onSelectDates={(inDate, outDate) => {
                      setPickupDate(inDate);
                      if (outDate) setReturnDate(outDate);
                    }}
                    onClose={() => setShowCalendarModal(false)}
                  />
                </div>
              )}
            </div>

            {/* Pickup & Dropoff Location Selector */}
            <div className="space-y-2 pt-1">
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                  Pickup Location
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none cursor-pointer"
                >
                  {availablePickupLocs.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                  Dropoff Location
                </label>
                <select
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none cursor-pointer"
                >
                  {availableDropoffLocs.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Offer Subtext */}
            <div className="border-t border-gray-100 pt-4 space-y-1">
              <h5 className="text-sm font-black text-navy-950">Global offer: Special Fleet Rate</h5>
              <p className="text-xs text-gray-500 font-medium">Price includes all applicable taxes and fees.</p>
            </div>

            {/* Total Row */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <span className="text-base font-black text-navy-950">Total</span>
              <span className="text-xl font-black text-navy-950">${totalCarPrice.toFixed(2)}</span>
            </div>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={handleReserve}
              className="w-full py-4 rounded-2xl bg-navy-950 hover:bg-black text-white font-black text-sm shadow-xl active:scale-98 transition-all text-center"
            >
              Reserve Now
            </button>

            <p className="text-[11px] text-gray-400 text-center font-medium">
              Payment will not be charged yet
            </p>

          </div>
        </div>

      </div>

      {/* Mobile Floating Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-purple-100 p-3.5 px-4 rounded-3xl shadow-2xl transition-all">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#2E0854]">${property.price_per_night}</span>
              <span className="text-xs text-gray-500 font-bold">/ day</span>
            </div>
            <span className="text-[11px] font-extrabold text-gray-400 block mt-0.5 tracking-tight">
              {formatDateDisplay(pickupDate)} – {formatDateDisplay(returnDate)}
            </span>
          </div>

          <button
            onClick={handleReserve}
            className="px-5 py-3 rounded-full bg-[#2E0854] hover:bg-black text-white font-black text-xs shadow-xl active:scale-95 shadow-purple-950/20 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Reserve Now</span>
          </button>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {showAllPhotosModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button
            onClick={() => setShowAllPhotosModal(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <img
                src={galleryImages[modalPhotoIndex]}
                alt="Vehicle full preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setModalPhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setModalPhotoIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <span className="text-white text-xs font-bold">
              Photo {modalPhotoIndex + 1} of {galleryImages.length}
            </span>
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
