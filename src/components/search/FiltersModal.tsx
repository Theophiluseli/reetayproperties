import React, { useState } from 'react';
import { X, Check, DollarSign } from 'lucide-react';
import { AMENITY_CHIPS, CAR_AMENITY_CHIPS } from '../../data/mockData';
import { VerticalType } from '../../types';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAmenities: string[];
  onApplyFilters: (amenities: string[], minPrice: number, maxPrice: number) => void;
  activeVertical?: VerticalType;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  selectedAmenities: initialAmenities,
  onApplyFilters,
  activeVertical = 'stays'
}) => {
  const [amenities, setAmenities] = useState<string[]>(initialAmenities);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const chipsList = activeVertical === 'cars' ? CAR_AMENITY_CHIPS : AMENITY_CHIPS;

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter(a => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleApply = () => {
    onApplyFilters(amenities, minPrice, maxPrice);
    onClose();
  };

  const handleReset = () => {
    setAmenities([]);
    setMinPrice(50);
    setMaxPrice(1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-navy-950">Filter Stays & Experiences</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-bold text-navy-950 mb-3">Price Range (Per Night)</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold-600" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Minimum</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="bg-transparent text-sm font-bold text-navy-950 outline-none w-full p-0"
                  />
                </div>
              </div>
              <span className="text-gray-300 font-bold">-</span>
              <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold-600" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Maximum</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="bg-transparent text-sm font-bold text-navy-950 outline-none w-full p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-navy-950 mb-3">Property Amenities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chipsList.map((chip) => {
                const checked = amenities.includes(chip);
                return (
                  <label
                    key={chip}
                    onClick={() => toggleAmenity(chip)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      checked
                        ? 'bg-gold-50/50 border-gold-500 text-navy-950 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      checked ? 'bg-gold-500 border-gold-600 text-navy-950' : 'border-gray-300 bg-white'
                    }`}>
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{chip}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-gray-500 hover:text-navy-950 underline"
          >
            Clear all filters
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 rounded-full bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md shadow-navy-950/20 active:scale-95 transition-all"
          >
            Show Results
          </button>
        </div>

      </div>
    </div>
  );
};
