import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, ChevronDown, Bed, Car, Sparkles } from 'lucide-react';
import { FilterState, VerticalType } from '../../types';
import { GuestStepperDropdown } from './GuestStepperDropdown';
import { DualCalendarPicker } from './DualCalendarPicker';
import { DEFAULT_PICKUP_LOCATIONS, DEFAULT_DROPOFF_LOCATIONS } from '../../data/mockData';

interface SegmentedSearchBarProps {
  filters: FilterState;
  onSearch: (newFilters: Partial<FilterState>) => void;
  onVerticalChange?: (v: VerticalType) => void;
}

export const SegmentedSearchBar: React.FC<SegmentedSearchBarProps> = ({ filters, onSearch, onVerticalChange }) => {
  const [destination, setDestination] = useState(filters.destination || '');
  const [checkIn, setCheckIn] = useState(filters.checkIn || '2026-08-13');
  const [checkOut, setCheckOut] = useState(filters.checkOut || '2026-08-18');
  
  // Stepper state
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);

  // Popover toggles
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPopover, setShowGuestsPopover] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

  const totalGuests = adults + childrenCount;

  const isCars = filters.vertical === 'cars';
  const [pickupLocation, setPickupLocation] = useState(filters.pickupLocation || '');
  const [dropoffLocation, setDropoffLocation] = useState(filters.dropoffLocation || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDatePicker(false);
    setShowGuestsPopover(false);
    setShowPickupDropdown(false);
    setShowDropoffDropdown(false);
    onSearch({
      destination: isCars ? pickupLocation : destination,
      pickupLocation,
      dropoffLocation,
      checkIn,
      checkOut,
      guests: totalGuests
    });
  };

  const filteredPickupOptions = DEFAULT_PICKUP_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(pickupLocation.toLowerCase())
  );

  const filteredDropoffOptions = DEFAULT_DROPOFF_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(dropoffLocation.toLowerCase())
  );

  const renderMobileSearchHeader = () => (
    <div className="block md:hidden w-full max-w-md mx-auto space-y-4 px-3 py-1">
      {/* Top Search Pill Bar (Optimized Icons & Padding) */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-full p-2 border border-purple-100/80 shadow-lg shadow-purple-950/5 flex items-center justify-between gap-3 relative"
      >
        {/* Left Location Icon */}
        <div className="w-10 h-10 rounded-full bg-purple-50 text-[#2E0854] border border-purple-100/80 flex items-center justify-center shadow-inner flex-shrink-0">
          <MapPin className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Middle Input / Text */}
        <div className="flex-1 min-w-0 text-left py-0.5">
          <label className="text-[10px] font-extrabold text-gray-400 block leading-tight uppercase tracking-wider">Where to?</label>
          <input
            type="text"
            placeholder="Mountain cabins, Accra..."
            value={isCars ? pickupLocation : destination}
            onChange={(e) => isCars ? setPickupLocation(e.target.value) : setDestination(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-black text-[#2E0854] outline-none placeholder:text-gray-400 p-0 truncate"
          />
        </div>

        {/* Right Primary Brand Search Button */}
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#2E0854] text-white hover:bg-black shadow-md flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
          title="Search"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Bottom Centered Vertical Category Pills (Generous Spacing & Brand Styling) */}
      {onVerticalChange && (
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-white rounded-full border border-purple-100 shadow-sm">
            <button
              type="button"
              onClick={() => onVerticalChange('stays')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                filters.vertical === 'stays'
                  ? 'bg-[#2E0854] text-white shadow-md'
                  : 'text-purple-950 hover:text-[#2E0854]'
              }`}
            >
              <Bed className={`w-4 h-4 ${filters.vertical === 'stays' ? 'text-white' : 'text-purple-400'}`} />
              <span>Stays</span>
            </button>

            <button
              type="button"
              onClick={() => onVerticalChange('cars')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                filters.vertical === 'cars'
                  ? 'bg-[#2E0854] text-white shadow-md'
                  : 'text-purple-950 hover:text-[#2E0854]'
              }`}
            >
              <Car className={`w-4 h-4 ${filters.vertical === 'cars' ? 'text-white' : 'text-purple-400'}`} />
              <span>Cars</span>
            </button>

            <button
              type="button"
              onClick={() => onVerticalChange('experiences')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                filters.vertical === 'experiences'
                  ? 'bg-[#2E0854] text-white shadow-md'
                  : 'text-purple-950 hover:text-[#2E0854]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${filters.vertical === 'experiences' ? 'text-white' : 'text-purple-400'}`} />
              <span>Experiences</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isCars) {
    return (
      <div className="w-full max-w-4xl mx-auto my-4 px-2 sm:px-4 relative z-40">
        {/* Mobile View */}
        {renderMobileSearchHeader()}

        {/* Desktop View */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex bg-white rounded-full p-2 border border-gray-200 shadow-xl shadow-gray-200/50 flex-col md:flex-row items-center justify-between gap-1 transition-all hover:shadow-2xl hover:border-amber-500/40 relative"
        >
          {/* Section 1: Pickup Location */}
          <div
            onClick={() => {
              setShowPickupDropdown(prev => !prev);
              setShowDropoffDropdown(false);
              setShowDatePicker(false);
            }}
            className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center gap-3"
          >
            <MapPin className="w-4 h-4 text-navy-950 flex-shrink-0" />
            <div className="flex flex-col flex-1">
              <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">PICKUP</label>
              <input
                type="text"
                placeholder="Pickup location"
                value={pickupLocation}
                onChange={(e) => {
                  setPickupLocation(e.target.value);
                  setShowPickupDropdown(true);
                }}
                onFocus={() => {
                  setShowPickupDropdown(true);
                  setShowDropoffDropdown(false);
                  setShowDatePicker(false);
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-950 outline-none placeholder:text-gray-400 p-0"
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Section 2: Dropoff Location */}
          <div
            onClick={() => {
              setShowDropoffDropdown(prev => !prev);
              setShowPickupDropdown(false);
              setShowDatePicker(false);
            }}
            className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center gap-3"
          >
            <MapPin className="w-4 h-4 text-navy-950 flex-shrink-0" />
            <div className="flex flex-col flex-1">
              <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">DROPOFF</label>
              <input
                type="text"
                placeholder="Dropoff location"
                value={dropoffLocation}
                onChange={(e) => {
                  setDropoffLocation(e.target.value);
                  setShowDropoffDropdown(true);
                }}
                onFocus={() => {
                  setShowDropoffDropdown(true);
                  setShowPickupDropdown(false);
                  setShowDatePicker(false);
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-950 outline-none placeholder:text-gray-400 p-0"
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Section 3: Add dates (Dual Calendar Trigger) */}
          <div
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowPickupDropdown(false);
              setShowDropoffDropdown(false);
            }}
            className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center gap-3"
          >
            <Calendar className="w-4 h-4 text-navy-950 flex-shrink-0" />
            <div className="flex flex-col flex-1">
              <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">DATES</label>
              <span className="text-xs sm:text-sm font-semibold text-navy-950 truncate">
                {checkIn && checkOut ? `${checkIn} → ${checkOut}` : 'Add dates'}
              </span>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 rounded-full bg-navy-950 hover:bg-black text-white font-extrabold text-xs sm:text-sm shadow-md shadow-navy-950/30 flex items-center justify-center gap-2 active:scale-95 transition-all flex-shrink-0"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>Search</span>
          </button>
        </form>

        {/* Pickup Location Dropdown Popover (Matching User Screenshot 1) */}
        {showPickupDropdown && (
          <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[280px] animate-in fade-in zoom-in-95">
            {(filteredPickupOptions.length > 0 ? filteredPickupOptions : DEFAULT_PICKUP_LOCATIONS).map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => {
                  setPickupLocation(loc);
                  setShowPickupDropdown(false);
                  onSearch({ pickupLocation: loc, dropoffLocation, checkIn, checkOut });
                }}
                className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-bold text-navy-950">{loc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Dropoff Location Dropdown Popover (Matching User Screenshot 2) */}
        {showDropoffDropdown && (
          <div className="absolute top-full left-1/4 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[280px] animate-in fade-in zoom-in-95">
            {(filteredDropoffOptions.length > 0 ? filteredDropoffOptions : DEFAULT_DROPOFF_LOCATIONS).map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => {
                  setDropoffLocation(loc);
                  setShowDropoffDropdown(false);
                  onSearch({ pickupLocation, dropoffLocation: loc, checkIn, checkOut });
                }}
                className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-bold text-navy-950">{loc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Calendar Popover */}
        {showDatePicker && (
          <div className="absolute top-full left-0 right-0 mt-3 flex justify-center z-50 animate-in fade-in zoom-in-95">
            <DualCalendarPicker
              checkIn={checkIn}
              checkOut={checkOut}
              onSelectDates={(inDate, outDate) => {
                setCheckIn(inDate);
                setCheckOut(outDate);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-2 sm:px-4 relative z-40">
      {/* Mobile View */}
      {renderMobileSearchHeader()}

      {/* Desktop View */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex bg-white rounded-full p-2 border border-gray-200 shadow-xl shadow-gray-200/50 flex-col md:flex-row items-center justify-between gap-1 transition-all hover:shadow-2xl hover:border-navy-950/40 relative"
      >
        {/* Section 1: Search Destinations */}
        <div className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center gap-3">
          <MapPin className="w-4 h-4 text-navy-950 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">WHERE</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-950 outline-none placeholder:text-gray-400 p-0"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* Section 2: DATES (Dual Calendar Trigger) */}
        <div
          onClick={() => {
            setShowDatePicker(!showDatePicker);
            setShowGuestsPopover(false);
          }}
          className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center gap-3"
        >
          <Calendar className="w-4 h-4 text-navy-950 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">DATES</label>
            <span className="text-xs sm:text-sm font-semibold text-navy-950 truncate">
              {checkIn && checkOut ? `${checkIn} → ${checkOut}` : 'Add dates'}
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* Section 3: WHO / GUESTS (Stepper Popover Trigger) */}
        <div
          onClick={() => {
            setShowGuestsPopover(!showGuestsPopover);
            setShowDatePicker(false);
          }}
          className="flex-1 w-full px-5 py-2.5 rounded-full hover:bg-gray-50/80 cursor-pointer transition-colors relative flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-navy-950 flex-shrink-0" />
            <div>
              <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">GUESTS</label>
              <span className="text-xs sm:text-sm font-semibold text-navy-950">
                {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'} {infants > 0 ? `, ${infants} infant` : ''}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        {/* Search Action Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 rounded-full bg-navy-950 hover:bg-black text-white font-extrabold text-xs sm:text-sm shadow-md shadow-navy-950/30 flex items-center justify-center gap-2 active:scale-95 transition-all flex-shrink-0"
        >
          <Search className="w-4 h-4 stroke-[3]" />
          <span>Search</span>
        </button>
      </form>

      {/* Popover 1: Dual Calendar Picker */}
      {showDatePicker && (
        <div className="absolute top-full left-0 right-0 mt-3 flex justify-center z-50 animate-in fade-in zoom-in-95">
          <DualCalendarPicker
            checkIn={checkIn}
            checkOut={checkOut}
            onSelectDates={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        </div>
      )}

      {/* Popover 2: Guest Stepper Dropdown */}
      {showGuestsPopover && (
        <div className="absolute top-full right-0 mt-3 z-50 flex justify-end animate-in fade-in zoom-in-95">
          <GuestStepperDropdown
            adults={adults}
            childrenCount={childrenCount}
            infants={infants}
            onChangeAdults={setAdults}
            onChangeChildren={setChildrenCount}
            onChangeInfants={setInfants}
            onClose={() => setShowGuestsPopover(false)}
          />
        </div>
      )}
    </div>
  );
};
