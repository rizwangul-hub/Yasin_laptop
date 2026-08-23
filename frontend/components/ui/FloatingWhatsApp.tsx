'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

export const FloatingWhatsApp: React.FC = () => {
  const cleanNumber = (DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923000000000').replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    'Assalam o Alaikum, I would like to inquire about available laptops and prices at Yasin Laptop Hub.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Contact Widget">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with Yasin Laptop Hub"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30 group"
      >
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">WhatsApp Inquiries</span>
      </a>
    </aside>
  );
};
