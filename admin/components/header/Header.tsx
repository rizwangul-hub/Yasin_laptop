'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-charcoal-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-charcoal-600 hover:text-charcoal-950 hover:bg-charcoal-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-charcoal-600 hidden sm:inline-block">
          Yasin Laptop Hub • Management Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
          <div className="w-7 h-7 rounded-lg bg-brand-500 text-charcoal-950 flex items-center justify-center font-black text-xs shadow-xs">
            YW
          </div>
          <div className="flex flex-col text-left pr-2">
            <span className="text-xs font-bold text-charcoal-950">Yasin Wahab</span>
            <span className="text-[10px] text-charcoal-500 font-medium">Owner &amp; Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
