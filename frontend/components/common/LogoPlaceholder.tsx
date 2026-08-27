import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImage from '../../image/logo.jpg';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  variant = 'light',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* 3D Rotating Logo Container */}
      <div
        className={`relative ${sizeClasses[size]} shrink-0 overflow-hidden rounded-2xl ${
          isDark
            ? 'bg-charcoal-900 border border-charcoal-700 shadow-md'
            : 'bg-white border border-charcoal-200/90 shadow-soft'
        } animate-rotate-x`}
      >
        <Image
          src={logoImage}
          alt="Yasin Laptop Hub logo"
          fill
          sizes="(max-width: 640px) 56px, 64px"
          className="object-contain p-1 rounded-2xl"
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${
              isDark ? 'text-white' : 'text-charcoal-950'
            } group-hover:text-brand-600 transition-colors ${textClasses[size]}`}
          >
            YASIN
          </span>
          <span
            className={`font-semibold tracking-tight ${
              isDark ? 'text-charcoal-300' : 'text-charcoal-700'
            } ${textClasses[size]}`}
          >
            LAPTOP HUB
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] ${
              isDark ? 'text-charcoal-400' : 'text-charcoal-500'
            } font-bold tracking-wider uppercase mt-1 flex items-center gap-1`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block"></span>
            <span>Lakki Marwat • Peshawar • Sargodha</span>
          </span>
        )}
      </div>
    </Link>
  );
};
