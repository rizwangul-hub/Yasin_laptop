import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Laptop, ArrowRight, Clock, Star, Truck, Award } from 'lucide-react';
import { SITE_URL, generateLocalBusinessJsonLd } from '@/lib/seo';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Laptops in Peshawar | Buy HP, Dell, Lenovo, Apple Laptops | Yasin Laptop Hub',
  description:
    'Looking for the best laptops in Peshawar? Yasin Laptop Hub Peshawar branch offers tested business laptops, Core i5/i7, MacBooks & Chromebooks with checking warranty & original chargers. Visit Saddar / University Road market or order via WhatsApp.',
  keywords: [
    'laptop in peshawar',
    'laptops in peshawar',
    'used laptops in peshawar',
    'hp laptops peshawar',
    'dell laptops peshawar',
    'lenovo thinkpad peshawar',
    'macbook in peshawar',
    'cheap laptops peshawar',
    'saddar computer market peshawar',
    'university road laptop shop peshawar',
    'yasin laptop hub peshawar',
  ],
  alternates: {
    canonical: `${SITE_URL}/laptops-in-peshawar`,
  },
  openGraph: {
    title: 'Laptops in Peshawar | Yasin Laptop Hub Peshawar Branch',
    description:
      'Buy authentic HP, Dell, Lenovo ThinkPads & Chromebooks in Peshawar, KPK. Live video testing, checking warranty, and original chargers. WhatsApp inquiry available.',
    url: `${SITE_URL}/laptops-in-peshawar`,
    images: [`${SITE_URL}/image/weblogo.jpg`],
  },
};

export default function PeshawarLaptopPage() {
  const cleanNumber = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);

  const peshawarSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Yasin Laptop Hub - Peshawar Branch',
    image: `${SITE_URL}/image/weblogo.jpg`,
    url: `${SITE_URL}/laptops-in-peshawar`,
    telephone: '+923427709129',
    priceRange: 'PKR 15,000 - 250,000',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash, Bank Transfer, EasyPaisa, JazzCash',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Saddar / University Road Computer Market',
      addressLocality: 'Peshawar',
      addressRegion: 'Khyber Pakhtunkhwa',
      postalCode: '25000',
      addressCountry: 'PK',
    },
    areaServed: [
      'Peshawar',
      'Hayatabad',
      'University of Peshawar',
      'Saddar Peshawar',
      'Charsadda',
      'Mardan',
      'Nowshera',
      'Khyber Pakhtunkhwa',
    ],
  };

  return (
    <div className="min-h-screen bg-warm-bg text-charcoal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(peshawarSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-brand-50 via-white to-warm-bg border-b border-charcoal-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 border border-brand-300 text-brand-900 text-xs font-bold shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Peshawar Regional Branch &bull; Saddar / University Road</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight">
            Best Laptops in <span className="text-brand-700">Peshawar</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Welcome to <strong className="text-charcoal-950 font-bold">Yasin Laptop Hub Peshawar</strong>. We supply verified HP EliteBooks, Dell Latitude &amp; XPS, Lenovo ThinkPads, MacBooks, and Chromebooks to university students, IT professionals, businesses, and graphic designers across Peshawar and KPK.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Laptop className="w-4 h-4" />
              <span>Browse Laptops in Peshawar</span>
            </Link>

            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Assalam o Alaikum, I am looking for a laptop in Peshawar.'
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

      {/* Featured Categories for Peshawar Buyers */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Popular Laptop Categories in Peshawar
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            Find the perfect match for university courses, software development, office work, or freelance freelancing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/laptops?brand=hp"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              HP
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">HP EliteBooks &amp; ProBooks</h3>
            <p className="text-xs text-charcoal-500 mt-1">Slim aluminium bodies, Core i5/i7 with high durability.</p>
          </Link>

          <Link
            href="/laptops?brand=dell"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              Dell
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Dell Latitude &amp; XPS</h3>
            <p className="text-xs text-charcoal-500 mt-1">Robust performance with SSD speeds and long battery health.</p>
          </Link>

          <Link
            href="/laptops?brand=lenovo"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              Lenovo
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Lenovo ThinkPads</h3>
            <p className="text-xs text-charcoal-500 mt-1">World-class keyboards ideal for typing, coding, and office.</p>
          </Link>

          <Link
            href="/chromebooks"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              Chrome
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Budget Chromebooks</h3>
            <p className="text-xs text-charcoal-500 mt-1">Fast boot, 8-10 hour battery backup starting under Rs. 25,000.</p>
          </Link>
        </div>
      </section>

      {/* Why Peshawar Customers Trust Us */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Why Buy from Yasin Laptop Hub in Peshawar?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            100% verified hardware with checking warranty and original accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Checking Warranty Included</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Every laptop delivered to Peshawar comes with full diagnostic verification covering battery, display, keyboard, and motherboard.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Fast Delivery in Peshawar &amp; KPK</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Same-day dispatch and safe delivery across Hayatabad, Saddar, University Campus, Charsadda, Mardan, and Swat.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Genuine Chargers &amp; Upgrades</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Authentic original power adapters included with optional RAM and high-speed NVMe SSD expansions on demand.
            </p>
          </div>
        </div>
      </section>

      {/* Peshawar Branch Info */}
      <section className="py-12 sm:py-16 bg-white border-y border-charcoal-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
              Peshawar Branch &amp; WhatsApp Support
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-medium">
              Get live video demonstrations of any laptop before purchasing. Ask questions, negotiate, or request custom software installations directly on WhatsApp.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-charcoal-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Saddar / University Road Computer Market, Peshawar, KPK</span>
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
            <h3 className="text-lg font-black text-charcoal-950">Order Laptops in Peshawar Now</h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Explore hundreds of in-stock models or contact owner Yasin Wahab for direct quotes.
            </p>
            <div className="pt-2">
              <Link
                href="/laptops"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all"
              >
                <span>View All In-Stock Laptops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
