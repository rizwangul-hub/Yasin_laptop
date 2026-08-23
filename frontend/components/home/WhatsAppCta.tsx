import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

export const WhatsAppCta: React.FC = () => {
  const whatsappUrl = DEFAULT_BUSINESS_CONFIG.whatsappNumber
    ? `https://wa.me/${DEFAULT_BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam o Alaikum, I am looking for a laptop recommendation for my budget.')}`
    : '#';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-emerald-950/60 border border-slate-800 p-8 sm:p-12 lg:p-16 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Personalized Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Looking for the Right Laptop?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Tell us your budget and requirements (Core i5, i7, RAM, storage, or Chromebook) and we will help you find the best option in stock.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={whatsappUrl}
            target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <Link
            href="/laptops"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
          >
            <span>Explore All Laptops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
