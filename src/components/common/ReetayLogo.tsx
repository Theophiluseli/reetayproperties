import React from 'react';

interface ReetayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ReetayLogo: React.FC<ReetayLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-14 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-28 w-auto'
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/reetay-logo.png"
        alt="Reetay Properties"
        className={`${sizeClasses} object-contain hover:scale-105 transition-transform duration-300`}
      />
    </div>
  );
};
