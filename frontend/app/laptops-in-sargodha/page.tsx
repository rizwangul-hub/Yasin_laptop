import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Laptop, ArrowRight, Clock, Star, Truck, Award } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Laptops in Sargodha | Buy HP, Dell, Lenovo Laptops | Yasin Laptop Hub',
  description:
    'Looking for the best laptop shop in Sargodha? Yasin Laptop Hub Sargodha branch offers inspected business laptops, Core i5/i7, MacBooks & Chromebooks with checking warranty & original chargers. Visit Kutchery Road / Trust Plaza or order via WhatsApp.',
  keywords: [
    'laptop in sargodha',
    'laptops in sargodha',
    'used laptops in sargodha',
    'hp laptops sargodha',
    'dell laptops sargodha',
    'trust plaza laptop market sargodha',
    'kutchery road computer shop sargodha',
    'yasin laptop hub sargodha',
  ],
  alternates: {
    canonical: `${SITE_URL}/laptops-in-sargodha`,
  },
  openGraph: {
    title: 'Laptops in Sargodha | Yasin Laptop Hub Sargodha Branch',
    description:
      'Buy authentic HP, Dell, Lenovo & Chromebooks in Sargodha, Punjab. 1-month checking warranty, original chargers & fast delivery. WhatsApp +92 342 7709129.',
    url: `${SITE_URL}/laptops-in-sargodha`,
    images: [`${SITE_URL}/image/weblogo.jpg`],
  },
};

export default function SargodhaLaptopPage() {
  const cleanNumber = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);

  const sargodhaSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Yasin Laptop Hub - Sargodha Branch',
    image: `${SITE_URL}/image/weblogo.jpg`,
    url: `${SITE_URL}/laptops-in-sargodha`,
    telephone: '+923427709129',
    priceRange: 'PKR 15,000 - 250,000',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash, Bank Transfer, EasyPaisa, JazzCash',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kutchery Road / Trust Plaza Computer Market',
      addressLocality: 'Sargodha',
      addressRegion: 'Punjab',
      postalCode: '40100',
      addressCountry: 'PK',
    },
    areaServed: [
      'Sargodha',
      'Trust Plaza',
      'University of Sargodha',
      'Satellite Town Sargodha',
      'Bhalwal',
      'Shahpur',
      'Punjab',
    ],
  };

  return (
    <div className="min-h-screen bg-warm-bg text-charcoal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sargodhaSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-brand-50 via-white to-warm-bg border-b border-charcoal-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 border border-brand-300 text-brand-900 text-xs font-bold shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sargodha Regional Branch &bull; Trust Plaza Computer Market</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight">
            Best Laptops in <span className="text-brand-700">Sargodha</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Welcome to <strong className="text-charcoal-950 font-bold">Yasin Laptop Hub Sargodha</strong>. We provide tested business laptops, Core i5/i7 models, Chromebooks, and original chargers to students, freelancers, and businesses across Sargodha and Punjab.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Laptop className="w-4 h-4" />
              <span>Browse Laptops in Sargodha</span>
            </Link>

            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Assalam o Alaikum, I am looking for a laptop in Sargodha.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry (+92 342 7709129)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sargodha Store Details */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Why Buy from Yasin Laptop Hub in Sargodha?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            Quality checking warranty, original wattage adapters, and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">1-Month Checking Warranty</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Every unit is tested with diagnostic benchmarks for battery timing, thermal paste cooling, display pixels, and keyboard health.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Original Chargers Included</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              We never supply cheap duplicate chargers. All laptop units include authentic original wattage adapters.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Delivery Across Punjab</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Fast delivery to Satellite Town, University of Sargodha, Bhalwal, Shahpur, and surrounding towns.
            </p>
          </div>
        </div>
      </section>

      {/* Sargodha Branch Location & WhatsApp CTA */}
      <section className="py-12 sm:py-16 bg-white border-y border-charcoal-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
              Visit Sargodha Branch or Chat on WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-medium">
              Check out available stock live, request diagnostic reports, or ask for special student discounts directly.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-charcoal-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Kutchery Road / Trust Plaza Computer Market, Sargodha, Punjab</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Monday &ndash; Saturday: 9:00 AM &ndash; 9:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-700 font-bold">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct WhatsApp: +92 342 7709129</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-warm-bg border border-charcoal-200 shadow-soft space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center mx-auto shadow-xs">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-charcoal-950">Explore Sargodha Inventory</h3>
            <p className="text-xs text-charcoal-500 font-medium">
              View live available HP, Dell, and Lenovo laptops with genuine checking warranty.
            </p>
            <div className="pt-2">
              <Link
                href="/laptops"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
