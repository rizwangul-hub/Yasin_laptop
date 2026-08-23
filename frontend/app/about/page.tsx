import React from 'react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { ShieldCheck, Laptop, Award, MapPin, CheckCircle2, MessageCircle, HeartHandshake, Truck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Yasin Laptop Hub | Owner Yasin Wahab',
  description: 'Learn about Yasin Laptop Hub, located in Lakki Marwat, KPK, Pakistan. Providing inspected laptops, Chromebooks, and verified computing hardware.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 bg-warm-bg">
      {/* Header */}
      <div className="space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold border border-brand-200">
          Our Story &amp; Quality Standard
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-950 tracking-tight">
          About Yasin Laptop Hub
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Your trusted destination for genuine inspected business laptops, student computers, and accessories with complete transparency and dedicated after-sales support.
        </p>
      </div>

      {/* Main Story Card */}
      <div className="rounded-3xl bg-white border border-charcoal-200/90 shadow-soft p-8 sm:p-12 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-charcoal-950">
            Founded &amp; Managed by {DEFAULT_BUSINESS_CONFIG.ownerName}
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
            Based in <strong className="text-charcoal-900 font-bold">Main Bazaar, Lakki Marwat (Khyber Pakhtunkhwa)</strong>, 
            Yasin Laptop Hub was founded to make reliable, high-performance computing hardware accessible to students, 
            freelancers, software developers, and business professionals across Pakistan without exorbitant prices.
          </p>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
            Every container shipment of laptops is personally inspected, diagnostic tested, and cleaned before being cataloged. 
            We believe in honest condition ratings, original chargers, and backing our machines with a 1-month checking warranty.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
          <div className="p-6 rounded-2xl bg-charcoal-50/80 border border-charcoal-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Multi-Point Quality Checks</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Every unit is thoroughly tested for battery health, keyboard responsiveness, crystal-clear IPS displays, thermals, and USB/Thunderbolt port integrity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-50/80 border border-charcoal-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">1-Month Checking Warranty</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Peace of mind is standard. Every laptop comes with a 1-month checking warranty and direct WhatsApp support for any setup assistance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-50/80 border border-charcoal-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Nationwide Safe Shipping</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Double-bubble padded packaging ensures your laptop arrives safely in Lakki Marwat, Bannu, Peshawar, Islamabad, Lahore, Karachi, or anywhere in Pakistan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-50/80 border border-charcoal-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Live Video Testing</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Request real-time pictures and live video tests of the exact laptop unit you want to buy on WhatsApp before completing your order.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-charcoal-950">Ready to explore our fresh stock?</h4>
            <p className="text-xs text-charcoal-500 font-medium">Browse verified HP, Dell, Lenovo ThinkPads &amp; Chromebooks.</p>
          </div>
          <Link
            href="/laptops"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Laptop Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
