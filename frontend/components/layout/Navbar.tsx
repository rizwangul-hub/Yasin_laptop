'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Laptop, Cpu, Grid, Layers, Info, Phone, ArrowRight } from 'lucide-react';
import { Logo } from '../common/LogoPlaceholder';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { cn } from '@/lib/formatters';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Laptops', href: '/laptops' },
  { name: 'Chromebooks', href: '/chromebooks' },
  { name: 'Categories', href: '/categories' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );
  const pathname = usePathname();

  useEffect(() => {
    import('@/services/settingsService').then(({ settingsService }) => {
      settingsService
        .getSettings()
        .then((res) => {
          if (res.success && res.data?.whatsappNumber) {
            setWhatsappNumber(res.data.whatsappNumber);
          }
        })
        .catch(() => {});
    });
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '923427709129';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I would like to inquire about laptops at Yasin Laptop Hub.'
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal-200/80 bg-white/95 backdrop-blur-md transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Logo showTagline variant="light" />

          {/* Desktop Navigation in Center */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-charcoal-100/70 p-1.5 rounded-2xl border border-charcoal-200/70">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'text-charcoal-950 bg-white shadow-xs border border-charcoal-200/90'
                      : 'text-charcoal-600 hover:text-charcoal-950 hover:bg-white/60'
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
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Action & Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:text-charcoal-950 hover:bg-charcoal-100 border border-charcoal-200 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-charcoal-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-soft-lg animate-fade-in">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-charcoal-950 bg-brand-50 border border-brand-300'
                    : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-charcoal-50'
                )}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-charcoal-400" />
              </Link>
            );
          })}
          <div className="pt-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp (+92 342 7709129)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
