import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Laptop, ArrowRight, Clock, Star } from 'lucide-react';
import { SITE_URL, SEO_CONFIG, generateLocalBusinessJsonLd } from '@/lib/seo';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Laptop Shop in Lakki Marwat | Yasin Laptop Hub',
  description:
    'Looking for a trusted laptop shop in Lakki Marwat, KPK? Visit Yasin Laptop Hub for authentic HP, Dell, Lenovo, and Apple laptops with checking warranty and original chargers.',
  alternates: {
    canonical: `${SITE_URL}/laptop-shop-lakki-marwat`,
  },
  openGraph: {
    title: 'Laptop Shop in Lakki Marwat | Yasin Laptop Hub',
    description:
      'Explore tested laptops, Chromebooks and accessories in Lakki Marwat, Khyber Pakhtunkhwa. Direct WhatsApp consultation with owner Yasin Wahab.',
    url: `${SITE_URL}/laptop-shop-lakki-marwat`,
  },
};

export default function LakkiMarwatLaptopShopPage() {
  const localBusinessSchema = generateLocalBusinessJsonLd();
  const cleanNumber = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);

  return (
    <div className="min-h-screen bg-warm-bg text-charcoal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-brand-50 via-white to-warm-bg border-b border-charcoal-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 border border-brand-300 text-brand-900 text-xs font-bold shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lakki Marwat, Khyber Pakhtunkhwa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight">
            Trusted Laptop Shop in <span className="text-brand-700">Lakki Marwat</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Welcome to <strong className="text-charcoal-950 font-bold">Yasin Laptop Hub</strong>, managed by <strong className="text-charcoal-950 font-bold">Yasin Wahab</strong>. We provide genuine, thoroughly inspected business laptops, student laptops, Chromebooks, and original accessories to customers across Lakki Marwat, Bannu, and surrounding districts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Laptop className="w-4 h-4" />
              <span>Browse In-Stock Laptops</span>
            </Link>

            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Assalam o Alaikum, I am looking for a laptop in Lakki Marwat.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp (+92 342 7709129)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Local Store Guarantee & Standards */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
            Why Buy from Yasin Laptop Hub in Lakki Marwat?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto font-medium">
            We inspect hardware thoroughly before placing it on our catalog so you get unmatched peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">1-Month Checking Warranty</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Every unit comes with an initial checking warranty to ensure memory, processor, display, keyboard, and battery are in 100% operational condition.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Genuine Power Adapters</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              No generic counterfeit chargers. We provide original wattage-compatible power adapters to preserve long-term battery health.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal-950">Direct Guidance by Owner</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Yasin Wahab directly assists you in selecting the ideal laptop based on your budget, whether for university studies, programming, or office work.
            </p>
          </div>
        </div>
      </section>

      {/* Store Location & Contact Grid */}
      <section className="py-12 sm:py-16 bg-white border-y border-charcoal-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950">
              Visit Our Shop or Contact Us
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-medium">
              We welcome customers to visit our store in Lakki Marwat or reach out via WhatsApp for photos, benchmark tests, and price negotiations.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-charcoal-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Main Bazaar, Lakki Marwat, Khyber Pakhtunkhwa, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Monday – Saturday: 9:00 AM – 9:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-700 font-bold">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fastest Response: WhatsApp (+92 342 7709129)</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-warm-bg border border-charcoal-200 shadow-soft space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center mx-auto shadow-xs">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-charcoal-950">Find Your Perfect Laptop Today</h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Browse our live inventory or send your requirements directly on WhatsApp.
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
