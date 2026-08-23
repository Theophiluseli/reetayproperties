import React from 'react';

interface ReetayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isRound?: boolean;
}

export const ReetayLogo: React.FC<ReetayLogoProps> = ({
  size = 'md',
  className = '',
  isRound = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <div
        className={`${sizeClasses} ${
          isRound ? 'rounded-full overflow-hidden shadow-md border border-amber-400/50 bg-[#1F0438]' : ''
        } flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        <img
          src="/reetay-logo.png"
          alt="Reetay Properties"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );
};
