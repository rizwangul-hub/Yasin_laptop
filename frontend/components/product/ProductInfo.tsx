'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPrice, buildProductWhatsAppUrl, buildPhoneUrl, sanitizeWhatsAppNumber } from '@/lib/formatters';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import {
  MessageCircle,
  Phone,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Check,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProductInfoProps {
  product: IProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );
  const [phoneNumber, setPhoneNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.phoneNumber || '03427709129'
  );

  useEffect(() => {
    import('@/services/settingsService').then(({ settingsService }) => {
      settingsService
        .getSettings()
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber);
            if (res.data.phoneNumber) setPhoneNumber(res.data.phoneNumber);
          }
        })
        .catch(() => {});
    });
  }, []);

  const brandName = typeof product.brand === 'object' && product.brand !== null ? product.brand.name : product.brand;
  const isAvailable = product.stockStatus === 'available';
  const hasSavings = product.previousPrice && product.previousPrice > product.price;
  const savingsAmount = hasSavings && product.previousPrice ? product.previousPrice - product.price : 0;

  const whatsappUrl = buildProductWhatsAppUrl(whatsappNumber, product);
  const phoneUrl = buildPhoneUrl(phoneNumber);

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Yasin Laptop Hub`,
      text: `Check out ${product.name} at Yasin Laptop Hub (Lakki Marwat, KPK)`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to clipboard if share cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. BRAND & BADGES */}
      <div className="flex items-center gap-2 flex-wrap">
        {brandName && (
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200 shadow-xs">
            {brandName}
          </span>
        )}

        <Badge variant={isAvailable ? 'success' : 'danger'} size="md">
          {isAvailable ? 'In Stock • Ready for Delivery' : 'Sold Out'}
        </Badge>

        {product.condition && (
          <Badge variant="neutral" size="md" className="capitalize">
            {product.condition.replace('-', ' ')} Condition
          </Badge>
        )}

        {product.featured && <Badge variant="brand" size="md">Featured</Badge>}
        {product.bestDeal && <Badge variant="warning" size="md">Best Deal</Badge>}
      </div>

      {/* 2. PRIMARY H1 TITLE */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal-950 tracking-tight leading-tight">
          {product.name}
        </h1>
        {product.laptopModel && (
          <p className="text-xs sm:text-sm font-semibold text-charcoal-500">
            Model Series: <span className="text-charcoal-800">{product.laptopModel}</span>
          </p>
        )}
      </div>

      {/* 3. PRICE CARD PANEL */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span className="text-xs text-charcoal-500 font-bold block mb-0.5">
              {isAvailable ? 'Final Cash / Online Transfer Price' : 'Last Recorded Price'}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-charcoal-950">
                {formatPrice(product.price)}
              </span>
              {hasSavings && product.previousPrice && (
                <span className="text-sm sm:text-base text-charcoal-400 line-through font-medium">
                  {formatPrice(product.previousPrice)}
                </span>
              )}
            </div>
          </div>

          {hasSavings && (
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-900 border border-brand-300 text-xs font-bold shrink-0">
              Save {formatPrice(savingsAmount)}
            </span>
          )}
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-charcoal-100 text-xs text-charcoal-700 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>1-Month Checking Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Original Charger Included</span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="pt-2 space-y-2.5">
          <a
            href={whatsappUrl}
            target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="w-full block"
          >
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full shadow-sm text-sm sm:text-base font-bold py-3.5"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>
                {isAvailable ? 'Inquire / Buy on WhatsApp' : 'Inquire Availability on WhatsApp'}
              </span>
            </Button>
          </a>

          <div className="grid grid-cols-2 gap-2.5">
            <a href={phoneUrl} className="w-full">
              <Button
                variant="dark"
                size="md"
                className="w-full text-xs font-bold"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                <span>Call Shop (0342 7709129)</span>
              </Button>
            </a>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleShare}
              className="w-full text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-1.5" />
                  <span>Share Laptop</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. KEY SPECIFICATIONS SUMMARY PILLS */}
      <div className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          Key Diagnostic Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-charcoal-800 font-medium">
          {product.specs?.processor && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">Processor</span>
              <span className="font-bold text-charcoal-950 truncate block">{product.specs.processor}</span>
            </div>
          )}

          {product.specs?.ram && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">RAM</span>
              <span className="font-bold text-charcoal-950 truncate block">{product.specs.ram}</span>
            </div>
          )}

          {product.specs?.storage && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">Storage</span>
              <span className="font-bold text-charcoal-950 truncate block">
                {product.specs.storage} {product.specs.storageType || 'SSD'}
              </span>
            </div>
          )}

          {product.specs?.displaySize && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">Display Size</span>
              <span className="font-bold text-charcoal-950 truncate block">{product.specs.displaySize}</span>
            </div>
          )}

          {product.condition && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">Body Condition</span>
              <span className="font-bold text-charcoal-950 capitalize truncate block">
                {product.condition.replace('-', ' ')}
              </span>
            </div>
          )}

          {product.specs?.operatingSystem && (
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <span className="text-[10px] text-charcoal-500 block">OS Installed</span>
              <span className="font-bold text-charcoal-950 truncate block">{product.specs.operatingSystem}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
