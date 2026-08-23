'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Store Location */}
        <Card className="p-6 space-y-4 bg-white border border-charcoal-200/90 shadow-soft rounded-3xl">
          <div className="w-11 h-11 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Store Location</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 font-medium">
              Main Bazaar, {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}
            </p>
          </div>
          <span className="text-[11px] text-charcoal-500 block pt-1 font-medium">
            Opposite City Hospital / Main Market
          </span>
        </Card>

        {/* Owner & WhatsApp */}
        <Card className="p-6 space-y-4 bg-white border border-charcoal-200/90 shadow-soft rounded-3xl">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Direct Assistance</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 font-medium">
              Managed by <strong className="text-charcoal-900">{DEFAULT_BUSINESS_CONFIG.ownerName}</strong>
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold pt-1"
          >
            <span>Message +92 342 7709129</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Card>

        {/* Social Media Channels */}
        <Card className="p-6 space-y-4 bg-white border border-charcoal-200/90 shadow-soft rounded-3xl">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5 fill-current text-rose-600" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Daily Video Channels</h3>
            <p className="text-xs text-charcoal-600 mt-1 font-medium">
              Watch stock updates on TikTok &amp; Instagram
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={socialLinks.tiktok || 'https://www.tiktok.com/@yasinlaptopslakkimarwat'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-charcoal-900 hover:text-brand-700 font-bold"
            >
              <span>TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-charcoal-300">•</span>
            <a
              href={socialLinks.instagram || 'https://www.instagram.com/yasinwahab6'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-pink-700 hover:text-pink-800 font-bold"
            >
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-6 space-y-4 bg-white border border-charcoal-200/90 shadow-soft rounded-3xl">
          <div className="w-11 h-11 rounded-2xl bg-brand-100 border border-brand-300 text-brand-900 flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Working Hours</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 font-medium">
              {DEFAULT_BUSINESS_CONFIG.openingHours || 'Monday – Saturday: 9:00 AM – 9:00 PM'}
            </p>
          </div>
          <span className="text-[11px] text-charcoal-500 block pt-1 font-medium">
            WhatsApp inquiries accepted 7 days a week
          </span>
        </Card>
      </div>
    </section>
  );
};
