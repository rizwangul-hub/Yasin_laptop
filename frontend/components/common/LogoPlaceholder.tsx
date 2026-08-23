import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImage from '../../image/logo.jpg';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      {/* 3D X-Axis Rotating Logo Container */}
      <div
        className={`relative ${sizeClasses[size]} shrink-0 overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-lg shadow-black/40 animate-rotate-x`}
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
            className={`font-black tracking-tight text-white group-hover:text-brand-400 transition-colors ${textClasses[size]}`}
          >
            YASIN
          </span>
          <span
            className={`font-medium tracking-tight text-slate-200 ${textClasses[size]}`}
          >
            LAPTOP HUB
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
            Lakki Marwat • KPK
          </span>
        )}
      </div>
    </Link>
  );
};
