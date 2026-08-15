import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  to?: string;
  onClick?: () => void;
  primary?: boolean;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  label,
  to,
  onClick,
  primary = false
}) => {
  const content = (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer active:scale-95 ${
        primary
          ? 'bg-navy-950 text-white border-navy-950 shadow-md hover:bg-navy-900'
          : 'bg-white text-navy-950 border-gray-200 hover:border-gold-500 hover:shadow-md'
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
        primary ? 'bg-gold-500 text-navy-950' : 'bg-gray-100 text-gold-600'
      }`}>
        <Icon className="w-4 h-4 stroke-[2.5]" />
      </div>
      <span className="text-xs font-bold">{label}</span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
};
