import React from 'react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_URL } from '@/lib/seo';

export const metadata = {
  title: 'Contact Us | Yasin Laptop Hub Lakki Marwat',
  description: 'Get in touch with Yasin Laptop Hub. Inquire about laptop prices, available inventory, or location in Lakki Marwat, KPK.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const whatsappUrl = DEFAULT_BUSINESS_CONFIG.whatsappNumber
    ? `https://wa.me/${DEFAULT_BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam o Alaikum, I would like to contact Yasin Laptop Hub.')}`
    : '#';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          Direct Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Yasin Laptop Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Need a laptop recommendation, current stock availability, or price inquiry? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Store Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white">Store Location &amp; Contact</h2>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium text-sm">Physical Store Address</strong>
                  <span>{DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium text-sm">Owner &amp; Manager</strong>
                  <span>{DEFAULT_BUSINESS_CONFIG.ownerName}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium text-sm">Shop Timings</strong>
                  <span>Monday – Saturday: 9:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-base font-bold text-white">Instant WhatsApp Chat</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Send us a message on WhatsApp for instant video checks, photos of actual units in stock, and price quotes.
            </p>
            <a
              href={whatsappUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
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
