import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/LogoPlaceholder';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { MapPin, Phone, MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal-800 bg-[#18181B] text-charcoal-300">
      {/* Value propositions strip */}
      <div className="border-b border-charcoal-800/80 py-8 bg-[#121214]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-900/60 border border-charcoal-800">
              <div className="p-3 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Checked &amp; Tested Laptops</h4>
                <p className="text-xs text-charcoal-400 font-medium">Quality inspected machines before delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-900/60 border border-charcoal-800">
              <div className="p-3 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/20">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">1-Month Checking Warranty</h4>
                <p className="text-xs text-charcoal-400 font-medium">Full diagnostic warranty on all laptop units</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-900/60 border border-charcoal-800">
              <div className="p-3 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Fast Nationwide Delivery</h4>
                <p className="text-xs text-charcoal-400 font-medium">Lakki Marwat, Bannu, KPK &amp; All Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo showTagline size="lg" variant="dark" />
            <p className="text-xs sm:text-sm text-charcoal-400 leading-relaxed font-normal">
              {DEFAULT_BUSINESS_CONFIG.businessDescription}
            </p>
            <div className="pt-2">
              <span className="text-xs text-charcoal-400">
                Owned &amp; Managed by <strong className="text-white">{DEFAULT_BUSINESS_CONFIG.ownerName}</strong>
              </span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              {/* TikTok */}
              <a
                href={DEFAULT_BUSINESS_CONFIG.socialLinks.tiktok || 'https://www.tiktok.com/@yasinlaptopslakkimarwat'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yasin Laptop Hub on TikTok"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white text-xs font-semibold transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current text-rose-400" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>TikTok</span>
              </a>

              {/* Instagram */}
              <a
                href={DEFAULT_BUSINESS_CONFIG.socialLinks.instagram || 'https://www.instagram.com/yasinwahab6'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yasin Wahab on Instagram"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white text-xs font-semibold transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current text-pink-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/laptops?category=business-laptops" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link href="/laptops?category=student-budget-laptops" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Student &amp; Budget Laptops
                </Link>
              </li>
              <li>
                <Link href="/chromebooks" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Chromebooks
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Laptop Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  About Yasin Laptop Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-charcoal-400 hover:text-brand-400 transition-colors">
                  Browse by Brand
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Store Location
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-charcoal-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  Main Bazaar, {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Phone: 03427709129</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="text-[#25D366] font-bold">WhatsApp: +92 342 7709129</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>© {currentYear} Yasin Laptop Hub. All rights reserved.</p>
          <p>
            Developed for <span className="text-charcoal-300 font-semibold">Yasin Wahab</span> • Lakki Marwat, KPK
          </p>
        </div>
      </div>
    </footer>
  );
};
