import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IProduct, IProductImage } from '@/types';
import { formatPrice, buildProductWhatsAppUrl } from '@/lib/formatters';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { Laptop, Cpu, HardDrive, MemoryStick, MessageCircle, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images?.find((img: IProductImage) => img.isPrimary || img.isMain) || product.images?.[0];
  const brandName = typeof product.brand === 'object' && product.brand !== null ? product.brand.name : product.brand || 'Laptop';
  const isAvailable = product.stockStatus === 'available';
  const isFeatured = Boolean(product.featured ?? product.isFeatured);
  const isBestDeal = Boolean(product.bestDeal ?? product.isBestDeal);
  const isLatestArrival = Boolean(product.latestArrival ?? product.isLatestArrival);

  const productUrl = `/laptops/${product.slug}`;
  const whatsappInquiryUrl = buildProductWhatsAppUrl(DEFAULT_BUSINESS_CONFIG.whatsappNumber, product);

  return (
    <Card hover className="flex flex-col h-full overflow-hidden bg-slate-900/80 border-slate-800">
      {/* Image & Badges Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-950/60 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        {mainImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage.url}
            alt={mainImage.alt || mainImage.altText || product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
            <Laptop className="w-12 h-12" />
            <span className="text-[11px] font-medium tracking-wider uppercase">Photo Studio Ready</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {isFeatured && (
            <Badge variant="brand" size="sm">
              Featured
            </Badge>
          )}
          {isBestDeal && (
            <Badge variant="accent" size="sm">
              Best Deal
            </Badge>
          )}
          {isLatestArrival && (
            <Badge variant="warning" size="sm">
              New Arrival
            </Badge>
          )}
        </div>

        {/* Stock / Condition Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'Available' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Brand & Condition */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-brand-400">
              {brandName}
            </span>
            {product.condition && (
              <span className="text-slate-400 capitalize">
                {product.condition.replace('-', ' ')}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group">
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short Specs Matrix */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-300">
            {product.specs?.processor && (
              <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                <Cpu className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">{product.specs.processor}</span>
              </div>
            )}

            {product.specs?.ram && (
              <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                <MemoryStick className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">{product.specs.ram}</span>
              </div>
            )}

            {product.specs?.storage && (
              <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 col-span-2 truncate">
                <HardDrive className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">
                  {product.specs.storage} {product.specs.storageType || 'SSD'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-xs text-slate-500 line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={productUrl} className="w-full">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="whatsapp" size="sm" className="w-full text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
