import React, { useRef } from 'react';
import { SlidersHorizontal, ChevronRight, Check } from 'lucide-react';
import { AMENITY_CHIPS, CAR_AMENITY_CHIPS } from '../../data/mockData';
import { VerticalType } from '../../types';

interface AmenityFilterRowProps {
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
  onOpenFiltersModal: () => void;
  activeVertical?: VerticalType;
}

export const AmenityFilterRow: React.FC<AmenityFilterRowProps> = ({
  selectedAmenities,
  onToggleAmenity,
  onOpenFiltersModal,
  activeVertical = 'stays'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipsList = activeVertical === 'cars' ? CAR_AMENITY_CHIPS : AMENITY_CHIPS;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
      {/* Scrollable Chips */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {chipsList.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => onToggleAmenity(amenity)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-navy-950 text-white border-navy-950 shadow-md ring-2 ring-black/20'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll Right Arrow Button */}
      <button
        onClick={scrollRight}
        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-navy-950 transition-all flex-shrink-0"
        title="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dedicated Filters Modal Button */}
      <button
        onClick={onOpenFiltersModal}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-950 text-white border border-navy-950 shadow-sm text-xs font-extrabold hover:bg-black hover:shadow-md transition-all flex-shrink-0"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
        <span>Filters</span>
        {selectedAmenities.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-white text-navy-950 text-[10px] font-black flex items-center justify-center">
            {selectedAmenities.length}
          </span>
        )}
      </button>
    </div>
  );
};
