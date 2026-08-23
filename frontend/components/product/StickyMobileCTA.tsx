'use client';

import React from 'react';
import { IProduct } from '@/types';
import { Button } from '../ui/Button';
import { MessageCircle, Phone } from 'lucide-react';
import { formatPrice, buildProductWhatsAppUrl, buildPhoneUrl } from '@/lib/formatters';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';

interface StickyMobileCTAProps {
  product: IProduct;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ product }) => {
  const isAvailable = product.stockStatus === 'available';
  const whatsappUrl = buildProductWhatsAppUrl(DEFAULT_BUSINESS_CONFIG.whatsappNumber, product);
  const phoneUrl = buildPhoneUrl(DEFAULT_BUSINESS_CONFIG.phoneNumber);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-slate-950/95 border-t border-slate-800 p-3 sm:p-4 backdrop-blur-md pb-[env(safe-area-inset-bottom,12px)] shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="min-w-0">
          <span className="text-[11px] text-slate-400 block font-medium">
            {isAvailable ? 'Cash / Transfer Price' : 'Availability Status'}
          </span>
          <span className="text-base sm:text-lg font-bold text-white truncate block">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {DEFAULT_BUSINESS_CONFIG.phoneNumber && (
            <a href={phoneUrl} aria-label="Call store">
              <Button variant="secondary" size="sm" className="px-3 py-2">
                <Phone className="w-4 h-4 text-brand-400" />
              </Button>
            </a>
          )}

          <a
            href={whatsappUrl}
            target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="sm" className="font-semibold text-xs py-2 px-4 shadow-md">
              <MessageCircle className="w-4 h-4 mr-1.5" />
              <span>{isAvailable ? 'WhatsApp' : 'Inquire'}</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
