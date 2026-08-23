import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImage from '../../image/logo.jpg';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl shadow-lg shadow-brand-600/30 ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105">
        <Image
          src={logoImage}
          alt="Yasin Laptop Hub logo"
          fill
          sizes="48px"
          className="logo-flag-wave object-cover"
          priority
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-300 transition-colors">
            YASIN
          </span>
          <span className="font-light text-lg tracking-tight text-slate-300">
            LAPTOP HUB
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            Lakki Marwat • KPK
          </span>
        )}
      </div>
    </Link>
  );
};
