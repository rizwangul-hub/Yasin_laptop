import React from 'react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_URL } from '@/lib/seo';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const metadata = {
  title: 'Contact Us | Yasin Laptop Hub Lakki Marwat',
  description: 'Get in touch with Yasin Laptop Hub. Inquire about laptop prices, available inventory, or location in Lakki Marwat, KPK.',
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
          Direct Store Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-950 tracking-tight">
          Contact Yasin Laptop Hub
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 max-w-xl mx-auto font-medium leading-relaxed">
          Need a laptop recommendation, checking warranty details, or current stock availability? Reach out directly to our shop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Store Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-6">
            <h2 className="text-xl font-black text-charcoal-950">Store Location &amp; Contact</h2>
            <div className="space-y-5 text-xs text-charcoal-600 font-medium">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-charcoal-950 font-bold text-sm">Physical Store Address</strong>
                  <span className="text-xs">Main Bazaar, {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-charcoal-950 font-bold text-sm">Owner &amp; Manager</strong>
                  <span className="text-xs">{DEFAULT_BUSINESS_CONFIG.ownerName} • 03427709129</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-charcoal-950 font-bold text-sm">Shop Timings</strong>
                  <span className="text-xs">Monday – Saturday: 9:00 AM – 9:00 PM</span>
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
              Send us a message on WhatsApp for instant video checks, photos of actual units in stock, and price quotes.
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
