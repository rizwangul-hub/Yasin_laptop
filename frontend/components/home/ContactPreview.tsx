'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Building2, Store } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG, STORE_BRANCHES } from '@/lib/business-config';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';
import { Card } from '../ui/Card';

export const ContactPreview: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );
  const [socialLinks, setSocialLinks] = useState(DEFAULT_BUSINESS_CONFIG.socialLinks);

  useEffect(() => {
    import('@/services/settingsService').then(({ settingsService }) => {
      settingsService
        .getSettings()
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber);
            if (res.data.socialLinks) {
              setSocialLinks((prev) => ({ ...prev, ...res.data?.socialLinks }));
            }
          }
        })
        .catch(() => {});
    });
  }, []);

  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Assalam o Alaikum, I would like to visit or contact Yasin Laptop Hub.'
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>Our Physical Outlets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight">
            Visit Our Stores in 3 Cities
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
            Lakki Marwat (Main Branch), Peshawar &amp; Sargodha with nationwide delivery across Pakistan.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 self-start sm:self-auto shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Assistance</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STORE_BRANCHES.map((branch) => {
          const branchWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(branch.whatsapp)}?text=${encodeURIComponent(
            `Assalam o Alaikum, I would like to inquire about laptops at Yasin Laptop Hub ${branch.city} branch.`
          )}`;

          return (
            <Card
              key={branch.id}
              className={`p-6 space-y-4 bg-white border shadow-soft rounded-3xl relative flex flex-col justify-between ${
                branch.isMain ? 'border-brand-400 ring-2 ring-brand-300/40' : 'border-charcoal-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center justify-center shadow-xs">
                    <MapPin className="w-5 h-5 text-brand-800" />
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
                  <h3 className="text-base font-black text-charcoal-950">
                    {branch.city} Shop
                  </h3>
                  <p className="text-xs text-charcoal-600 font-medium mt-1 leading-relaxed">
                    {branch.address}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-charcoal-500 font-medium pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span className="text-charcoal-800 font-bold">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span>{branch.timings}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${branch.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-800 text-xs font-bold transition-colors"
                >
                  Call Store
                </a>
                <a
                  href={branchWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#20bd5a] font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
