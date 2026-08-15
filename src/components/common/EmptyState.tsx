import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  headline: string;
  helperText: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  headline,
  helperText,
  ctaText,
  onCtaClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm my-4">
      <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 mb-4 ring-8 ring-gold-50/50">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-extrabold text-navy-950 mb-1">{headline}</h3>
      <p className="text-sm text-gray-500 font-medium max-w-md mb-6">{helperText}</p>
      {ctaText && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="px-6 py-2.5 rounded-full bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};
