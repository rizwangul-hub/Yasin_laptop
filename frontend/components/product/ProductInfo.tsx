'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPrice, buildProductWhatsAppUrl, buildPhoneUrl } from '@/lib/formatters';
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
} from 'lucide-react';

interface ProductInfoProps {
  product: IProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);

  const brandName = typeof product.brand === 'object' && product.brand !== null ? product.brand.name : product.brand;
  const isAvailable = product.stockStatus === 'available';
  const hasSavings = product.previousPrice && product.previousPrice > product.price;
  const savingsAmount = hasSavings && product.previousPrice ? product.previousPrice - product.price : 0;

  const whatsappUrl = buildProductWhatsAppUrl(DEFAULT_BUSINESS_CONFIG.whatsappNumber, product);
  const phoneUrl = buildPhoneUrl(DEFAULT_BUSINESS_CONFIG.phoneNumber);

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Yasin Laptop Hub`,
      text: `Check out ${product.name} at Yasin Laptop Hub (Lakki Marwat, KPK)`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
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
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-800/60">
            {brandName}
          </span>
        )}

        <Badge variant={isAvailable ? 'success' : 'danger'} size="md">
          {isAvailable ? 'In Stock • Ready for Delivery' : 'Sold Out'}
        </Badge>

        {product.condition && (
          <Badge variant="brand" size="md" className="capitalize">
            {product.condition.replace('-', ' ')} Condition
          </Badge>
        )}

        {product.featured && <Badge variant="warning" size="md">Featured</Badge>}
        {product.bestDeal && <Badge variant="accent" size="md">Best Deal</Badge>}
      </div>

      {/* 2. PRIMARY H1 TITLE */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {product.name}
        </h1>

        {product.shortDescription && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* 3. PRICE DISPLAY */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatPrice(product.price)}
          </span>

          {hasSavings && (
            <span className="text-base sm:text-lg text-slate-500 line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}

          {hasSavings && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
              Save {formatPrice(savingsAmount)}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          Pakistani Rupee (PKR) price • Includes quality inspection &amp; warranty
        </p>
      </div>

      {/* 4. PRIMARY ACTION BUTTONS */}
      <div className="space-y-3 pt-2">
        {/* WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full text-sm sm:text-base font-bold shadow-lg shadow-emerald-950/50 justify-center py-4"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            <span>{isAvailable ? 'Order / Inquire on WhatsApp' : 'Ask About Similar Laptops'}</span>
          </Button>
        </a>

        {/* Call & Share Row */}
        <div className="grid grid-cols-2 gap-3">
          {DEFAULT_BUSINESS_CONFIG.phoneNumber ? (
            <a href={phoneUrl} className="w-full">
              <Button variant="secondary" size="md" className="w-full text-xs font-semibold justify-center">
                <Phone className="w-4 h-4 mr-1.5 text-brand-400" />
                <span>Call Store</span>
              </Button>
            </a>
          ) : (
            <Button variant="secondary" size="md" disabled className="w-full text-xs font-semibold justify-center opacity-60">
              <Phone className="w-4 h-4 mr-1.5" />
              <span>Call Phone</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleShare}
            className="w-full text-xs font-semibold justify-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-1.5 text-slate-300" />
                <span>Share Laptop</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 5. QUICK INCLUSIONS & TRUST STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <Zap className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-xs text-slate-300">
            {product.chargerIncluded ? 'Charger Included' : 'Charger Available Separately'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-xs text-slate-300">
            {product.warranty ? `Warranty: ${product.warranty}` : 'Checking Warranty Included'}
          </span>
        </div>
      </div>

      {/* 6. CATEGORIES & USE CASES */}
      <div className="space-y-3 pt-2">
        {product.categories && product.categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Categories:</span>
            {product.categories.map((cat, idx) => {
              const catName = typeof cat === 'object' && cat !== null ? cat.name : cat;
              const catSlug = typeof cat === 'object' && cat !== null ? cat.slug : cat;
              return (
                <Link
                  key={idx}
                  href={`/categories/${catSlug}`}
                  className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                >
                  {catName}
                </Link>
              );
            })}
          </div>
        )}

        {product.useCases && product.useCases.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Suitable For:</span>
            {product.useCases.map((uc, idx) => {
              const ucName = typeof uc === 'object' && uc !== null ? uc.name : uc;
              return (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 text-[11px]"
                >
                  {ucName}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
