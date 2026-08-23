import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IAccessory, IProductImage } from '@/types';
import { formatPrice, buildWhatsAppUrl } from '@/lib/formatters';
import { ImagePresets } from '@/lib/cloudinary';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { Layers, MessageCircle, ArrowRight } from 'lucide-react';

interface AccessoryCardProps {
  accessory: IAccessory;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({ accessory }) => {
  const mainImage =
    accessory.images?.find((img: IProductImage) => img.isPrimary || img.isMain) ||
    accessory.images?.[0];
  const optimizedImageUrl = ImagePresets.productCard(mainImage?.url);
  const isAvailable = accessory.stockStatus === 'available';

  const accessoryUrl = `/accessories?item=${accessory.slug}`;

  const whatsappInquiryUrl = buildWhatsAppUrl(DEFAULT_BUSINESS_CONFIG.whatsappNumber, {
    name: accessory.name,
    condition: accessory.condition,
    price: accessory.price,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}${accessoryUrl}`,
  });

  return (
    <Card
      hover
      className="flex flex-col h-full overflow-hidden bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 transition-all duration-200 group rounded-2xl sm:rounded-3xl"
    >
      {/* Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-[#F8F8F4] flex items-center justify-center overflow-hidden border-b border-charcoal-100">
        {optimizedImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizedImageUrl}
            alt={mainImage?.alt || mainImage?.altText || accessory.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2.5 sm:p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-charcoal-400 gap-1 p-4">
            <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-charcoal-300" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-charcoal-400">
              Original Gear
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <Badge variant="brand" size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
            {accessory.category || 'Accessory'}
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
            {isAvailable ? 'In Stock' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <Link href={accessoryUrl} className="block group/title">
            <h3 className="text-xs sm:text-sm lg:text-base font-bold text-charcoal-950 group-hover/title:text-brand-700 transition-colors line-clamp-2 leading-snug">
              {accessory.name}
            </h3>
          </Link>

          {accessory.description && (
            <p className="text-[11px] sm:text-xs text-charcoal-500 line-clamp-2 leading-relaxed font-medium">
              {accessory.description}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-2.5 border-t border-charcoal-100 space-y-2.5">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm sm:text-base lg:text-lg font-black text-charcoal-950 truncate">
              {formatPrice(accessory.price)}
            </span>
            {accessory.previousPrice && accessory.previousPrice > accessory.price && (
              <span className="text-[10px] sm:text-xs text-charcoal-400 line-through shrink-0">
                {formatPrice(accessory.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Link href={accessoryUrl} className="w-full">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-[11px] sm:text-xs font-bold py-2 px-1.5 min-h-[36px] sm:min-h-[40px] shadow-xs"
              >
                <span>Details</span>
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
