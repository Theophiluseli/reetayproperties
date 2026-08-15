import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface GuestStepperDropdownProps {
  adults: number;
  childrenCount: number;
  infants: number;
  maxGuests?: number;
  onChangeAdults: (val: number) => void;
  onChangeChildren: (val: number) => void;
  onChangeInfants: (val: number) => void;
  onClose?: () => void;
}

export const GuestStepperDropdown: React.FC<GuestStepperDropdownProps> = ({
  adults,
  childrenCount,
  infants,
  maxGuests = 6,
  onChangeAdults,
  onChangeChildren,
  onChangeInfants
}) => {
  const totalGuests = adults + childrenCount;

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xl space-y-4 text-left w-full max-w-sm font-sans animate-in fade-in zoom-in-95">
      
      {/* Adults */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h4 className="text-sm font-extrabold text-navy-950">Adults</h4>
          <p className="text-xs text-gray-400 font-medium">Age 13+</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={adults <= 1}
            onClick={() => onChangeAdults(Math.max(1, adults - 1))}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-4 text-center font-extrabold text-sm text-navy-950">{adults}</span>
          <button
            type="button"
            disabled={totalGuests >= maxGuests}
            onClick={() => onChangeAdults(adults + 1)}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Children */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h4 className="text-sm font-extrabold text-navy-950">Children</h4>
          <p className="text-xs text-gray-400 font-medium">Ages 2-12</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={childrenCount <= 0}
            onClick={() => onChangeChildren(Math.max(0, childrenCount - 1))}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-4 text-center font-extrabold text-sm text-navy-950">{childrenCount}</span>
          <button
            type="button"
            disabled={totalGuests >= maxGuests}
            onClick={() => onChangeChildren(childrenCount + 1)}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Infants */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h4 className="text-sm font-extrabold text-navy-950">Infants</h4>
          <p className="text-xs text-gray-400 font-medium">Under 2</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={infants <= 0}
            onClick={() => onChangeInfants(Math.max(0, infants - 1))}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-4 text-center font-extrabold text-sm text-navy-950">{infants}</span>
          <button
            type="button"
            disabled={infants >= 4}
            onClick={() => onChangeInfants(infants + 1)}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-navy-950 text-navy-950 flex items-center justify-center font-bold disabled:opacity-40 disabled:hover:border-gray-200 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400">
          Maximum {maxGuests} guests allowed
        </p>
      </div>

    </div>
  );
};
