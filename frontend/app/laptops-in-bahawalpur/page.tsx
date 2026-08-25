import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Laptop, ArrowRight, Clock, Star, Truck, Award, Wallet } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Laptops in Bahawalpur | Buy Used HP, Dell, Lenovo Laptops | Yasin Laptop Hub',
  description:
    'Looking to buy reliable laptops in Bahawalpur? Yasin Laptop Hub offers tested HP, Dell, Lenovo ThinkPads, MacBooks & Chromebooks with checking warranty, original chargers & fast COD delivery across Bahawalpur & South Punjab. WhatsApp +92 342 7709129.',
  keywords: [
    'laptop in bahawalpur',
    'laptops in bahawalpur',
    'used laptops in bahawalpur',
    'buy laptop bahawalpur',
    'hp laptops in bahawalpur',
    'dell laptops bahawalpur',
    'cheap laptops in bahawalpur',
    'iub laptop bahawalpur',
    'student laptops bahawalpur',
    'yasin laptop hub bahawalpur',
  ],
  alternates: {
    canonical: `${SITE_URL}/laptops-in-bahawalpur`,
  },
  openGraph: {
    title: 'Laptops in Bahawalpur | Yasin Laptop Hub Delivery & Store',
    description:
      'Buy authentic HP, Dell, Lenovo & Chromebooks in Bahawalpur. Safe cash on delivery, 1-month checking warranty, and original chargers. WhatsApp +92 342 7709129.',
    url: `${SITE_URL}/laptops-in-bahawalpur`,
    images: [`${SITE_URL}/image/weblogo.jpg`],
  },
};

export default function BahawalpurLaptopPage() {
  const cleanNumber = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);

  const bahawalpurSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Yasin Laptop Hub - Bahawalpur Service & Delivery',
    image: `${SITE_URL}/image/weblogo.jpg`,
    url: `${SITE_URL}/laptops-in-bahawalpur`,
    telephone: '+923427709129',
    priceRange: 'PKR 15,000 - 250,000',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery, Bank Transfer, EasyPaisa, JazzCash',
    areaServed: [
      'Bahawalpur',
      'Islamia University Bahawalpur (IUB)',
      'Model Town Bahawalpur',
      'Cantt Bahawalpur',
      'Ahmedpur East',
      'Yazman',
      'Bahawalnagar',
      'Rahim Yar Khan',
      'South Punjab',
    ],
  };

  return (
    <div className="min-h-screen bg-warm-bg text-charcoal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bahawalpurSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/60 via-white to-warm-bg border-b border-charcoal-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Serving Bahawalpur &bull; Students, IUB &amp; Professionals</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight">
            Buy Quality Laptops in <span className="text-brand-700">Bahawalpur</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Looking for authentic, thoroughly tested HP, Dell, Lenovo, and Apple laptops in <strong className="text-charcoal-950 font-bold">Bahawalpur</strong>? <strong className="text-charcoal-950 font-bold">Yasin Laptop Hub</strong> delivers checked machines with live video testing on WhatsApp, checking warranty, and original chargers right to your doorstep.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Laptop className="w-4 h-4" />
              <span>Explore In-Stock Laptops</span>
            </Link>

            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Assalam o Alaikum, I am looking for a laptop in Bahawalpur.'
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

      {/* Budget Friendly Filters for Bahawalpur Students & Freelancers */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Shop by Budget in Bahawalpur
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            Handpicked options for Islamia University Bahawalpur (IUB) students, online freelancers, and office work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/laptops?maxPrice=30000"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Under Rs. 30,000</h3>
            <p className="text-xs text-charcoal-500 mt-1">Lightweight Chromebooks and Core i3/i5 study laptops.</p>
          </Link>

          <Link
            href="/laptops?minPrice=30000&maxPrice=50000"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Rs. 30,000 &ndash; 50,000</h3>
            <p className="text-xs text-charcoal-500 mt-1">Core i5 7th/8th Gen with SSD speeds &amp; 8GB RAM.</p>
          </Link>

          <Link
            href="/laptops?minPrice=50000&maxPrice=70000"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Rs. 50,000 &ndash; 70,000</h3>
            <p className="text-xs text-charcoal-500 mt-1">High-speed Core i7 &amp; 16GB RAM for programming &amp; design.</p>
          </Link>

          <Link
            href="/laptops?minPrice=70000"
            className="p-5 rounded-2xl bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-charcoal-950 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-950 group-hover:text-brand-700">Above Rs. 70,000</h3>
            <p className="text-xs text-charcoal-500 mt-1">Touch screens, MacBooks, and powerful workstations.</p>
          </Link>
        </div>
      </section>

      {/* Bahawalpur Customer Benefits */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Why Bahawalpur Customers Buy From Yasin Laptop Hub
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            Transparent testing, real customer satisfaction, and guaranteed working hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Live WhatsApp Video Inspection</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              We send actual videos and pictures of the specific laptop serial number so you see the exact body condition and battery timing before it ships to Bahawalpur.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Safe &amp; Insured Delivery</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Padded bubble-wrapped packaging delivered reliably to Model Town, Cantt, IUB Campus, Ahmedpur East, and throughout South Punjab.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Checking Warranty &amp; Support</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Enjoy peace of mind with our checking warranty. If you need any assistance with software or drivers, our team assists you directly.
            </p>
          </div>
        </div>
      </section>

      {/* Bahawalpur Call to Action */}
      <section className="py-12 sm:py-16 bg-white border-y border-charcoal-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
              Need a Laptop in Bahawalpur? Let&apos;s Chat!
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-medium">
              Tell owner Yasin Wahab your budget and requirements, and we will send you the best available options with immediate video proof.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-charcoal-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Fast Nationwide Delivery to Bahawalpur, IUB &amp; South Punjab</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Customer Support: 9:00 AM &ndash; 10:00 PM Daily</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-700 font-bold">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Helpline: +92 342 7709129</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-warm-bg border border-charcoal-200 shadow-soft space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center mx-auto shadow-xs">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-charcoal-950">Find Your Laptop in Bahawalpur</h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Select from over 100+ tested business and gaming laptop models today.
            </p>
            <div className="pt-2">
              <Link
                href="/laptops"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all"
              >
                <span>Browse All Laptops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
