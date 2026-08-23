'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Laptop, Sparkles } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const WhatsAppCta: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );

  useEffect(() => {
    import('@/services/settingsService').then(({ settingsService }) => {
      settingsService
        .getSettings()
        .then((res) => {
          if (res.success && res.data?.whatsappNumber) {
            setWhatsappNumber(res.data.whatsappNumber);
          }
        })
        .catch(() => {});
    });
  }, []);

  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I am looking for a laptop recommendation for my budget at Yasin Laptop Hub.'
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-50 via-white to-amber-50/60 border border-brand-200 p-8 sm:p-12 lg:p-14 text-center space-y-6 shadow-soft">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Personalized Store Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal-950 tracking-tight">
            Looking for the Right Laptop for Your Budget?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl mx-auto font-medium">
            Tell us your work requirements (Core i5, i7, RAM, SSD, or Chromebook) and we will send you photos, video checks, and exact pricing for models currently in stock.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+92 342 7709129)</span>
          </a>

          <Link
            href="/laptops"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-charcoal-50 text-charcoal-900 font-bold text-sm border border-charcoal-200 shadow-soft transition-all"
          >
            <span>Explore All Laptops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
