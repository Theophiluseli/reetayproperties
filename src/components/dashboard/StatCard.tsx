import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  caption: string;
  badgeColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  caption,
  badgeColor = 'bg-gold-50 text-gold-600'
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-2xl ${badgeColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-black text-navy-950 tracking-tight">{value}</div>
        <div className="text-xs text-gray-400 font-medium mt-1">{caption}</div>
      </div>
    </div>
  );
};
