import React from 'react';
import { Laptop } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform duration-200">
        <Laptop className="w-5 h-5" />
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
