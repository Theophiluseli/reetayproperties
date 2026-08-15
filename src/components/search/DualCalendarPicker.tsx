import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface DualCalendarPickerProps {
  checkIn: string;
  checkOut: string;
  onSelectDates: (checkIn: string, checkOut: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

export const DualCalendarPicker: React.FC<DualCalendarPickerProps> = ({
  checkIn,
  checkOut,
  onSelectDates,
  onClose
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [selectedIn, setSelectedIn] = useState(checkIn || '2026-09-10');
  const [selectedOut, setSelectedOut] = useState(checkOut || '2026-09-14');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOffset = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (dateStr: string) => {
    if (!selectedIn || (selectedIn && selectedOut)) {
      setSelectedIn(dateStr);
      setSelectedOut('');
      onSelectDates(dateStr, '');
    } else {
      if (new Date(dateStr) < new Date(selectedIn)) {
        setSelectedIn(dateStr);
        setSelectedOut('');
        onSelectDates(dateStr, '');
      } else {
        setSelectedOut(dateStr);
        onSelectDates(selectedIn, dateStr);
      }
    }
  };

  const handlePresetSelect = (days: number) => {
    const start = selectedIn ? new Date(selectedIn) : new Date(2026, 8, 10);
    const end = new Date(start);
    end.setDate(start.getDate() + days);

    const format = (d: Date) => d.toISOString().split('T')[0];
    const inStr = format(start);
    const outStr = format(end);

    setSelectedIn(inStr);
    setSelectedOut(outStr);
    onSelectDates(inStr, outStr);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOffset(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const cells = [];

  // Offset cells (previous month faint days)
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    cells.push(
      <div key={`prev-${i}`} className="h-7 w-7 sm:h-8 sm:w-8 mx-auto flex items-center justify-center text-[11px] font-semibold text-gray-300 pointer-events-none">
        {prevMonthDays - i}
      </div>
    );
  }

  // Days of current month
  for (let day = 1; day <= totalDays; day++) {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDateStr = `${year}-${monthStr}-${dayStr}`;

    const isStart = fullDateStr === selectedIn;
    const isEnd = fullDateStr === selectedOut;
    const isInRange =
      selectedIn &&
      selectedOut &&
      new Date(fullDateStr) > new Date(selectedIn) &&
      new Date(fullDateStr) < new Date(selectedOut);

    let cellStyle = 'hover:bg-purple-100 hover:text-navy-950 text-navy-950 rounded-lg';
    if (isStart || isEnd) {
      cellStyle = 'bg-navy-950 text-white font-black rounded-lg shadow-md ring-2 ring-navy-950/20';
    } else if (isInRange) {
      cellStyle = 'bg-purple-100 text-purple-950 font-extrabold rounded-md';
    }

    cells.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(fullDateStr)}
        className={`h-7 w-7 sm:h-8 sm:w-8 mx-auto flex items-center justify-center text-xs font-extrabold transition-all ${cellStyle}`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xl space-y-3.5 text-left font-sans animate-in fade-in zoom-in-95 w-full max-w-[340px] z-50">
      {/* Month Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-navy-950 hover:bg-gray-100 transition-all"
          title="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h4 className="text-xs sm:text-sm font-black text-navy-950 tracking-tight">
          {monthNames[month]} {year}
        </h4>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-navy-950 hover:bg-gray-100 transition-all"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all ml-1"
              title="Close calendar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Duration Presets Row */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={() => handlePresetSelect(3)}
          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-100 hover:bg-navy-950 hover:text-white transition-all text-navy-950"
        >
          3 Nights
        </button>
        <button
          type="button"
          onClick={() => handlePresetSelect(5)}
          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-100 hover:bg-navy-950 hover:text-white transition-all text-navy-950"
        >
          5 Nights
        </button>
        <button
          type="button"
          onClick={() => handlePresetSelect(7)}
          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-100 hover:bg-navy-950 hover:text-white transition-all text-navy-950"
        >
          1 Week
        </button>
      </div>

      {/* Days of Week & Month Grid */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-7 text-center gap-1 text-[10px] font-black uppercase text-gray-400">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-semibold">
          {cells}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
        <div className="text-[11px] font-bold text-navy-950 truncate">
          <span>{selectedIn || 'Check-in'}</span>
          <span className="mx-1 text-gray-400">→</span>
          <span>{selectedOut || 'Check-out'}</span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-navy-950 text-white font-extrabold hover:bg-black shadow-md transition-all flex items-center gap-1 flex-shrink-0"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Apply</span>
          </button>
        )}
      </div>
    </div>
  );
};
