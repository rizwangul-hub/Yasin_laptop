import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IProduct, IProductImage } from '@/types';
import { formatPrice, buildProductWhatsAppUrl } from '@/lib/formatters';
import { ImagePresets } from '@/lib/cloudinary';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { Laptop, Cpu, HardDrive, MemoryStick, MessageCircle, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage =
    product.images?.find((img: IProductImage) => img.isPrimary || img.isMain) ||
    product.images?.[0];
  const optimizedImageUrl = ImagePresets.productCard(mainImage?.url);
  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : product.brand || 'Laptop';
  const isAvailable = product.stockStatus === 'available';
  const isFeatured = Boolean(product.featured ?? product.isFeatured);
  const isBestDeal = Boolean(product.bestDeal ?? product.bestDeal);
  const isLatestArrival = Boolean(product.latestArrival ?? product.latestArrival);

  const productUrl = `/laptops/${product.slug}`;
  const whatsappInquiryUrl = buildProductWhatsAppUrl(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber,
    product
  );

  return (
    <Card
      hover
      className="flex flex-col h-full overflow-hidden bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 transition-all duration-200 group rounded-2xl sm:rounded-3xl"
    >
      {/* Image & Badges Container */}
      <div className="relative w-full aspect-[4/3] bg-[#F8F8F4] flex items-center justify-center overflow-hidden border-b border-charcoal-100">
        {optimizedImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizedImageUrl}
            alt={mainImage?.alt || mainImage?.altText || product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2.5 sm:p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-charcoal-400 gap-1.5 p-4">
            <Laptop className="w-8 h-8 sm:w-12 sm:h-12 text-charcoal-300" />
            <span className="text-[9px] sm:text-[11px] font-bold tracking-wider uppercase text-charcoal-400">
              Verified Unit
            </span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {isBestDeal ? (
            <Badge variant="warning" size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Best Deal
            </Badge>
          ) : isFeatured ? (
            <Badge variant="brand" size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Featured
            </Badge>
          ) : isLatestArrival ? (
            <Badge variant="dark" size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
              New
            </Badge>
          ) : null}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
            {isAvailable ? 'In Stock' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Brand & Condition Pill */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs">
            <span className="font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-brand-200 truncate">
              {brandName}
            </span>
            {product.condition && (
              <span className="text-charcoal-500 font-medium capitalize text-[10px] sm:text-[11px] truncate">
                {product.condition.replace('-', ' ')}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group/title">
            <h3 className="text-xs sm:text-sm lg:text-base font-bold text-charcoal-950 group-hover/title:text-brand-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Quick Specs Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-0.5 text-[10px] sm:text-[11px] text-charcoal-700 font-medium">
            {product.specs?.processor && (
              <div className="flex items-center gap-1 bg-charcoal-50 px-2 py-1 rounded-lg border border-charcoal-200/60 truncate">
                <Cpu className="w-3 h-3 text-brand-700 shrink-0" />
                <span className="truncate">{product.specs.processor}</span>
              </div>
            )}

            {(product.specs?.ram || product.specs?.storage) && (
              <div className="flex items-center gap-1 bg-charcoal-50 px-2 py-1 rounded-lg border border-charcoal-200/60 truncate">
                <MemoryStick className="w-3 h-3 text-brand-700 shrink-0" />
                <span className="truncate">
                  {product.specs?.ram ? `${product.specs.ram} • ` : ''}
                  {product.specs?.storage || 'SSD'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2.5 border-t border-charcoal-100 space-y-2.5">
          <div className="flex items-baseline justify-between gap-1">
            <div className="min-w-0">
              <span className="text-[10px] text-charcoal-400 block font-medium uppercase tracking-wider">
                {isAvailable ? 'Price' : 'Last Price'}
              </span>
              <span className="text-sm sm:text-base lg:text-lg font-black text-charcoal-950 truncate block">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-charcoal-400 line-through shrink-0">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Link href={productUrl} className="w-full">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-[11px] sm:text-xs font-bold py-2 px-1.5 min-h-[36px] sm:min-h-[40px] shadow-xs"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3 ml-0.5 hidden sm:inline" />
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
                className="w-full text-[11px] sm:text-xs font-bold py-2 px-1.5 min-h-[36px] sm:min-h-[40px] shadow-xs"
              >
                <MessageCircle className="w-3 h-3 mr-1 shrink-0" />
                <span>WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
