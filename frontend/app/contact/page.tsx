import React from 'react';
import Link from 'next/link';
import { DEFAULT_BUSINESS_CONFIG, STORE_BRANCHES } from '@/lib/business-config';
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck, ExternalLink, Store } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_URL } from '@/lib/seo';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata = {
  title: 'Store Locations & Contact | Yasin Laptop Hub (Lakki Marwat, Peshawar, Sargodha)',
  description: 'Visit Yasin Laptop Hub physical shops in Lakki Marwat, Peshawar, and Sargodha. Inquire about laptop prices, warranty, and available stock.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const cleanNumber = sanitizeWhatsAppNumber(DEFAULT_BUSINESS_CONFIG.whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I would like to contact Yasin Laptop Hub.'
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 bg-warm-bg">
      {/* Header */}
      <div className="space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold border border-brand-200">
          3 Physical Locations • Nationwide Delivery
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-950 tracking-tight">
          Our Stores &amp; Contact Details
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Visit our stores in <strong className="text-charcoal-950 font-bold">Lakki Marwat</strong>, <strong className="text-charcoal-950 font-bold">Peshawar</strong>, and <strong className="text-charcoal-950 font-bold">Sargodha</strong>, or connect directly on WhatsApp for live video testing and home delivery across Pakistan.
        </p>
      </div>

      {/* 3 Physical Store Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_BRANCHES.map((branch) => {
          const branchWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(branch.whatsapp)}?text=${encodeURIComponent(
            `Assalam o Alaikum, I would like to visit or check stock at Yasin Laptop Hub (${branch.city} Branch).`
          )}`;

          return (
            <div
              key={branch.id}
              className={`p-6 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 ${
                branch.isMain ? 'border-brand-400 ring-2 ring-brand-300/40' : 'border-charcoal-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center justify-center shadow-xs">
                    <Store className="w-5 h-5 text-brand-800" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      branch.isMain
                        ? 'bg-brand-500 text-charcoal-950 border-brand-600'
                        : 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
                    }`}
                  >
                    {branch.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-charcoal-950">
                    {branch.city} Branch
                  </h3>
                  <p className="text-xs text-charcoal-600 font-medium mt-1 leading-relaxed">
                    {branch.address}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-charcoal-500 font-medium pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span className="text-charcoal-900 font-bold">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span>{branch.timings}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${branch.phone}`}
                    className="px-3 py-2 rounded-xl bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-800 text-xs font-bold transition-colors"
                  >
                    Call Shop
                  </a>
                  <Link
                    href={branch.pageHref}
                    className="px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-bold transition-colors"
                  >
                    City Hub
                  </Link>
                </div>
                <a
                  href={branchWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Form & Main Office Support */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Column: Direct Support & Owner Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-6">
            <h2 className="text-xl font-black text-charcoal-950">Management &amp; Warranty Support</h2>
            <div className="space-y-4 text-xs text-charcoal-600 font-medium">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-brand-800" />
                </div>
                <div>
                  <strong className="block text-charcoal-950 font-bold text-sm">Owner &amp; Managing Director</strong>
                  <span className="text-xs">{DEFAULT_BUSINESS_CONFIG.ownerName} • 03427709129</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4 text-brand-800" />
                </div>
                <div>
                  <strong className="block text-charcoal-950 font-bold text-sm">Customer Support Hours</strong>
                  <span className="text-xs">Mon – Sat: 9:00 AM – 9:00 PM (WhatsApp available 7 days)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/80 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-base font-bold text-charcoal-950">Instant WhatsApp Inquiries</h2>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
              Send us a message on WhatsApp for instant video checks, photos of actual units in stock at our branches, and price quotes.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp (+92 342 7709129)</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
