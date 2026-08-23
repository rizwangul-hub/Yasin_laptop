'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { settingsService } from '@/services/settingsService';

export const FloatingWhatsApp: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );
  const pathname = usePathname();

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => {
        if (res.success && res.data?.whatsappNumber) {
          setWhatsappNumber(res.data.whatsappNumber);
        }
      })
      .catch(() => {
        // Silent fallback
      });
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '923427709129';
  const message = encodeURIComponent(
    'Assalam o Alaikum, I would like to inquire about available laptops and prices at Yasin Laptop Hub.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  // Hide on mobile product detail pages to prevent overlapping StickyMobileCTA
  const isProductDetailPage = pathname.startsWith('/laptops/') && pathname !== '/laptops';

  return (
    <aside aria-label="WhatsApp Contact Widget">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with Yasin Laptop Hub"
        className={`fixed bottom-5 right-5 z-40 items-center gap-2 px-3.5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-soft-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 group ${
          isProductDetailPage ? 'hidden lg:flex' : 'flex'
        }`}
      >
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">WhatsApp Inquiries</span>
      </a>
    </aside>
  );
};
