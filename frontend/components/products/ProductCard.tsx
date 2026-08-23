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
  const mainImage =
    product.images?.find((img: IProductImage) => img.isPrimary || img.isMain) ||
    product.images?.[0];
  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : product.brand || 'Laptop';
  const isAvailable = product.stockStatus === 'available';
  const isFeatured = Boolean(product.featured ?? product.isFeatured);
  const isBestDeal = Boolean(product.bestDeal ?? product.isBestDeal);
  const isLatestArrival = Boolean(product.latestArrival ?? product.isLatestArrival);

  const productUrl = `/laptops/${product.slug}`;
  const whatsappInquiryUrl = buildProductWhatsAppUrl(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber,
    product
  );

  return (
    <Card
      hover
      className="flex flex-col h-full overflow-hidden bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 transition-all duration-300 group rounded-3xl"
    >
      {/* Image & Badges Container */}
      <div className="relative w-full aspect-[4/3] bg-[#F8F8F4] flex items-center justify-center overflow-hidden border-b border-charcoal-100">
        {mainImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage.url}
            alt={mainImage.alt || mainImage.altText || product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-charcoal-400 gap-2">
            <Laptop className="w-12 h-12 text-charcoal-300" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-charcoal-400">
              Tested Hardware
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isFeatured && (
            <Badge variant="brand" size="sm">
              Featured
            </Badge>
          )}
          {isBestDeal && (
            <Badge variant="warning" size="sm">
              Best Deal
            </Badge>
          )}
          {isLatestArrival && (
            <Badge variant="dark" size="sm">
              New Arrival
            </Badge>
          )}
        </div>

        {/* Stock / Availability Pill */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'In Stock' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Brand & Condition */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
              {brandName}
            </span>
            {product.condition && (
              <span className="text-charcoal-500 font-medium capitalize text-[11px]">
                {product.condition.replace('-', ' ')}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group/title">
            <h3 className="text-sm sm:text-base font-bold text-charcoal-950 group-hover/title:text-brand-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Quick Specs Matrix */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-charcoal-700 font-medium">
            {product.specs?.processor && (
              <div className="flex items-center gap-1.5 bg-charcoal-50/80 px-2.5 py-1.5 rounded-lg border border-charcoal-200/60 truncate">
                <Cpu className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{product.specs.processor}</span>
              </div>
            )}

            {product.specs?.ram && (
              <div className="flex items-center gap-1.5 bg-charcoal-50/80 px-2.5 py-1.5 rounded-lg border border-charcoal-200/60 truncate">
                <MemoryStick className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{product.specs.ram}</span>
              </div>
            )}

            {product.specs?.storage && (
              <div className="flex items-center gap-1.5 bg-charcoal-50/80 px-2.5 py-1.5 rounded-lg border border-charcoal-200/60 col-span-2 truncate">
                <HardDrive className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">
                  {product.specs.storage} {product.specs.storageType || 'SSD'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-charcoal-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-charcoal-400 block font-medium">
                {isAvailable ? 'PKR Price' : 'Last Price'}
              </span>
              <span className="text-lg sm:text-xl font-black text-charcoal-950">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={productUrl} className="w-full">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="whatsapp"
                size="sm"
                className="w-full text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1" />
                <span>WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
