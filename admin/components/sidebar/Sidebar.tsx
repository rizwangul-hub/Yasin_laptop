'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Laptop,
  PlusCircle,
  FolderTree,
  Building2,
  Cpu,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Search,
  Activity,
  User,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'All Products', href: '/products', icon: Laptop },
  { name: 'Add Product', href: '/products/new', icon: PlusCircle },
  { name: 'Leads & Inquiries', href: '/inquiries', icon: MessageSquare },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Brands', href: '/brands', icon: Building2 },
  { name: 'Use Cases', href: '/use-cases', icon: Cpu },
  { name: 'Accessories', href: '/accessories', icon: Layers },
  { name: 'Hero Media', href: '/hero-media', icon: ImageIcon },
  { name: 'Media Library', href: '/media', icon: ImageIcon },
  { name: 'Activity Log', href: '/activity', icon: Activity },
  { name: 'Business Settings', href: '/settings', icon: Settings },
  { name: 'SEO Settings', href: '/seo', icon: Search },
  { name: 'Admin Profile', href: '/profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-600/30">
                Y
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight text-white">Yasin Laptop Hub</span>
                <span className="text-[10px] text-slate-400">Admin SaaS Control</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions & Profile Bar */}
        <div className="p-3 border-t border-slate-800 space-y-1.5 bg-slate-950/80">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">{user?.name || 'Yasin Wahab'}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 text-brand-400 font-semibold uppercase text-[9px]">
              Admin
            </span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
