import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/LogoPlaceholder';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { MapPin, Phone, MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Value propositions banner */}
      <div className="border-b border-slate-850 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="p-3 rounded-lg bg-brand-500/10 text-brand-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Checked & Tested Laptops</h4>
                <p className="text-xs text-slate-400">Quality inspected machines before delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="p-3 rounded-lg bg-brand-500/10 text-brand-400">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Warranty Support</h4>
                <p className="text-xs text-slate-400">Checking warranty provided on all units</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="p-3 rounded-lg bg-brand-500/10 text-brand-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Fast Delivery</h4>
                <p className="text-xs text-slate-400">Lakki Marwat & Nationwide Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo showTagline />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {DEFAULT_BUSINESS_CONFIG.businessDescription}
            </p>
            <div className="pt-2">
              <span className="text-xs text-slate-500">
                Owned & Managed by <strong className="text-slate-300">{DEFAULT_BUSINESS_CONFIG.ownerName}</strong>
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/laptops" className="hover:text-white transition-colors">
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link href="/laptops" className="hover:text-white transition-colors">
                  Student Laptops
                </Link>
              </li>
              <li>
                <Link href="/chromebooks" className="hover:text-white transition-colors">
                  Chromebooks
                </Link>
              </li>
              <li>
                <Link href="/laptops" className="hover:text-white transition-colors">
                  High Performance
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-white transition-colors">
                  Laptop Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Yasin Laptop Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">
                  Browse by Brand
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Store Location
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Direct inquiries via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Fast WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Yasin Laptop Hub. All rights reserved.</p>
          <p>
            Developed for <span className="text-slate-400">Yasin Wahab</span> • Lakki Marwat, KPK
          </p>
        </div>
      </div>
    </footer>
  );
};
