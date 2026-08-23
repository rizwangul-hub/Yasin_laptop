import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Laptop, ArrowRight, Clock, Star } from 'lucide-react';
import { SITE_URL, SEO_CONFIG, generateLocalBusinessJsonLd } from '@/lib/seo';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { formatPrice } from '@/lib/formatters';

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lakki Marwat, Khyber Pakhtunkhwa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Trusted Laptop Shop in <span className="text-brand-400">Lakki Marwat</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">Yasin Laptop Hub</strong>, managed by <strong className="text-white">Yasin Wahab</strong>. We provide genuine, thoroughly inspected business laptops, student laptops, Chromebooks, and original accessories to customers across Lakki Marwat and surrounding districts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
            >
              <Laptop className="w-4 h-4" />
              <span>Browse In-Stock Laptops</span>
            </Link>

            <a
              href={`https://wa.me/${DEFAULT_BUSINESS_CONFIG.whatsappNumber}?text=Assalam%20o%20Alaikum%2C%20I%20am%20looking%20for%20a%20laptop%20in%20Lakki%20Marwat.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Local Store Guarantee & Standards */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Buy from Yasin Laptop Hub in Lakki Marwat?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            We inspect hardware thoroughly before placing it on our catalog so you get unmatched peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Checking Warranty Included</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every unit comes with an initial checking warranty to ensure memory, processor, display, keyboard, and battery are in 100% operational condition.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Genuine Power Adapters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No generic counterfeit chargers. We provide original wattage-compatible power adapters to preserve long-term battery health.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Guidance by Owner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yasin Wahab directly assists you in selecting the ideal laptop based on your budget, whether for university studies, programming, or office work.
            </p>
          </div>
        </div>
      </section>

      {/* Store Location & Contact Grid */}
      <section className="py-12 sm:py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Visit Our Shop or Contact Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We welcome customers to visit our store in Lakki Marwat or reach out via WhatsApp for photos, benchmark tests, and price negotiations.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Lakki Marwat, Khyber Pakhtunkhwa, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Monday – Saturday: 9:00 AM – 9:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fastest Response: WhatsApp Instant Chat</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/15 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Find Your Perfect Laptop Today</h3>
            <p className="text-xs text-slate-400">
              Browse our live inventory or send your requirements directly on WhatsApp.
            </p>
            <div className="pt-2 space-y-2">
              <Link
                href="/laptops"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all"
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
