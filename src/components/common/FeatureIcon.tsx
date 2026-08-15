import React from 'react';
import {
  Wind,
  Dumbbell,
  Flame,
  Refrigerator,
  Waves,
  Wifi,
  Car,
  Tv,
  RefreshCw,
  Zap,
  ShieldCheck,
  Utensils,
  Layers,
  Sparkles,
  Bed
} from 'lucide-react';

interface FeatureIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const getAmenityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('ac') || n.includes('air conditioning')) return Wind;
  if (n.includes('gym')) return Dumbbell;
  if (n.includes('heater') || n.includes('heat')) return Flame;
  if (n.includes('fridge') || n.includes('refrigerator')) return Refrigerator;
  if (n.includes('pool') || n.includes('swimming')) return Waves;
  if (n.includes('wifi') || n.includes('internet')) return Wifi;
  if (n.includes('parking') || n.includes('car')) return Car;
  if (n.includes('tv') || n.includes('netflix')) return Tv;
  if (n.includes('washer') || n.includes('dryer')) return RefreshCw;
  if (n.includes('generator') || n.includes('power')) return Zap;
  if (n.includes('security') || n.includes('concierge')) return ShieldCheck;
  if (n.includes('kitchen')) return Utensils;
  if (n.includes('microwave')) return Layers;
  if (n.includes('stove')) return Flame;
  if (n.includes('pillow') || n.includes('blanket')) return Bed;
  return Sparkles;
};

export const FeatureIcon: React.FC<FeatureIconProps> = ({
  name,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const IconComponent = getAmenityIcon(name);

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5'
  }[size];

  const paddingSizes = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-3.5 py-2 text-xs'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 rounded-2xl bg-purple-50/80 border border-purple-100 text-[#2E0854] font-extrabold transition-all ${paddingSizes} ${className}`}>
      <IconComponent className={`${iconSizes} text-[#2E0854] flex-shrink-0`} />
      {showLabel && <span className="leading-tight">{name}</span>}
    </div>
  );
};
