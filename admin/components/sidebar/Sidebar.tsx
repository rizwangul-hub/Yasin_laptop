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
  Star,
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
  { name: 'Customer Reviews', href: '/reviews', icon: Star },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Brands', href: '/brands', icon: Building2 },
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-charcoal-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-charcoal-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-xl bg-charcoal-50 border border-charcoal-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Yasin Laptop Hub Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-charcoal-950">Yasin Laptop Hub</span>
                <span className="text-[10px] text-charcoal-500 font-medium">Admin Portal</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-charcoal-500 hover:text-charcoal-950 lg:hidden"
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-charcoal-950 border border-brand-300 shadow-xs'
                      : 'text-charcoal-600 hover:text-charcoal-950 hover:bg-charcoal-100/70 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-700' : 'text-charcoal-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions & Profile Bar */}
        <div className="p-3 border-t border-charcoal-200 space-y-1.5 bg-charcoal-50/60">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] text-charcoal-600 font-medium">
            <span className="truncate">{user?.name || 'Yasin Wahab'}</span>
            <span className="px-2 py-0.5 rounded-md bg-brand-100 border border-brand-200 text-brand-900 font-bold uppercase text-[9px]">
              Admin
            </span>
          </div>

          <a
            href={process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-charcoal-700 hover:text-charcoal-950 hover:bg-charcoal-100 transition-colors font-semibold"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
