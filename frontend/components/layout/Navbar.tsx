'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Laptop, Cpu, Grid, Info, Phone } from 'lucide-react';
import { Logo } from '../common/LogoPlaceholder';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { cn } from '@/lib/formatters';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Laptop },
  { name: 'Laptops', href: '/laptops', icon: Laptop },
  { name: 'Chromebooks', href: '/chromebooks', icon: Cpu },
  { name: 'Categories', href: '/categories', icon: Grid },
  { name: 'About Us', href: '/about', icon: Info },
  { name: 'Contact Us', href: '/contact', icon: Phone },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const whatsappUrl = DEFAULT_BUSINESS_CONFIG.whatsappNumber
    ? `https://wa.me/${DEFAULT_BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam o Alaikum, I would like to inquire about laptops at Yasin Laptop Hub.')}`
    : '#';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Logo showTagline />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop WhatsApp Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-md shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1 shadow-2xl">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white bg-slate-800/90'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                )}
              >
                <Icon className="w-4 h-4 text-brand-400" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3">
            <a
              href={whatsappUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
