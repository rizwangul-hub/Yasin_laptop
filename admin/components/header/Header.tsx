'use client';

import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">
          Yasin Laptop Hub • Management Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-7 h-7 rounded-md bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold text-xs">
            YW
          </div>
          <div className="flex flex-col text-left pr-2">
            <span className="text-xs font-semibold text-white">Yasin Wahab</span>
            <span className="text-[10px] text-slate-400">Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
};
