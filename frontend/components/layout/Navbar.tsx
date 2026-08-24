'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  MessageCircle,
  Search,
  Laptop,
  Layers,
  Phone,
  Info,
  ArrowRight,
  ShieldCheck,
  Tag,
  Home,
  SlidersHorizontal,
} from 'lucide-react';
import { Logo } from '../common/LogoPlaceholder';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { cn, sanitizeWhatsAppNumber } from '@/lib/formatters';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Laptops', href: '/laptops', icon: Laptop },
  { name: 'Chromebooks', href: '/chromebooks', icon: SlidersHorizontal },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Accessories', href: '/accessories', icon: Layers },
  { name: 'About Us', href: '/about', icon: Info },
  { name: 'Contact & Branches', href: '/contact', icon: Phone },
];

const CATEGORY_SHORTCUTS = [
  { label: 'HP Laptops', href: '/laptops?brand=hp' },
  { label: 'Dell Laptops', href: '/laptops?brand=dell' },
  { label: 'Lenovo Laptops', href: '/laptops?brand=lenovo' },
  { label: 'Chromebooks', href: '/chromebooks' },
  { label: 'Under 30K', href: '/laptops?maxPrice=30000' },
  { label: '30K – 40K', href: '/laptops?minPrice=30000&maxPrice=40000' },
  { label: '40K – 50K', href: '/laptops?minPrice=40000&maxPrice=50000' },
  { label: '50K – 70K', href: '/laptops?minPrice=50000&maxPrice=70000' },
  { label: 'Low to High', href: '/laptops?sort=price_asc' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );
  const pathname = usePathname();
  const router = useRouter();

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I would like to inquire about laptops at Yasin Laptop Hub.'
  )}`;

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/laptops?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo showTagline variant="light" />
          </div>

          {/* Desktop Navigation in Center */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-charcoal-100/70 p-1.5 rounded-2xl border border-charcoal-200/70">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150',
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Right Controls: [Search] [WhatsApp] [Hamburger Menu] */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2.5 rounded-xl text-charcoal-800 hover:text-charcoal-950 bg-charcoal-100/80 hover:bg-charcoal-200/80 border border-charcoal-300/80 transition-colors"
              aria-label="Search laptops"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Store Inquiries"
              className="p-2.5 rounded-xl bg-[#25D366] text-white shadow-xs hover:bg-[#20bd5a] transition-all"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* High-Contrast Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-charcoal-950 hover:bg-charcoal-900 text-brand-400 border border-charcoal-800 shadow-sm transition-transform active:scale-95 flex items-center justify-center"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-brand-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Strip */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 py-3 bg-charcoal-50 border-t border-charcoal-200 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleMobileSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, brands, models..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-charcoal-300 text-xs sm:text-sm text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* High-Contrast Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-[320px] sm:max-w-sm bg-warm-bg h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-charcoal-200">
            {/* Drawer Top Header */}
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-200 bg-white shadow-xs">
                <Logo showTagline={false} variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-charcoal-700 hover:text-charcoal-950 bg-charcoal-100 hover:bg-charcoal-200 border border-charcoal-300 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with High-Contrast Cards */}
              <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-230px)]">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500 block px-1 mb-1">
                  Menu Navigation
                </span>

                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all border shadow-xs',
                        isActive
                          ? 'text-charcoal-950 bg-brand-500 border-brand-600 font-black shadow-sm'
                          : 'text-charcoal-900 bg-white border-charcoal-200/90 hover:bg-brand-50 hover:border-brand-300 hover:text-charcoal-950'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                            isActive
                              ? 'bg-charcoal-950 text-brand-400'
                              : 'bg-charcoal-100 text-charcoal-700'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.name}</span>
                      </div>
                      <ArrowRight
                        className={cn(
                          'w-4 h-4',
                          isActive ? 'text-charcoal-950 font-black' : 'text-charcoal-400'
                        )}
                      />
                    </Link>
                  );
                })}

                {/* Quick Category Chips with High-Contrast */}
                <div className="pt-4 mt-2 border-t border-charcoal-200/80">
                  <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500 block px-1 mb-2">
                    Popular Categories &amp; Filters
                  </span>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {CATEGORY_SHORTCUTS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-charcoal-300 text-charcoal-900 hover:text-charcoal-950 font-bold transition-colors shadow-xs"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="p-4 border-t border-charcoal-200 bg-white space-y-2.5 pb-[env(safe-area-inset-bottom,16px)] shadow-soft">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-black shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+92 342 7709129)</span>
              </a>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lakki Marwat • Peshawar • Sargodha</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
