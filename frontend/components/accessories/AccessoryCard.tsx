import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IAccessory, IProductImage } from '@/types';
import { formatPrice, buildWhatsAppUrl } from '@/lib/formatters';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { Layers, MessageCircle, ArrowRight } from 'lucide-react';

interface AccessoryCardProps {
  accessory: IAccessory;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({ accessory }) => {
  const mainImage =
    accessory.images?.find((img: IProductImage) => img.isPrimary || img.isMain) ||
    accessory.images?.[0];
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
      className="flex flex-col h-full overflow-hidden bg-white border border-charcoal-200/90 shadow-soft hover:shadow-soft-md hover:border-brand-500/80 transition-all duration-300 group rounded-3xl"
    >
      {/* Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-[#F8F8F4] flex items-center justify-center overflow-hidden border-b border-charcoal-100">
        {mainImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage.url}
            alt={mainImage.alt || mainImage.altText || accessory.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-charcoal-400 gap-2">
            <Layers className="w-10 h-10 text-charcoal-300" />
            <span className="text-[10px] font-medium tracking-wider uppercase text-charcoal-400">
              Genuine Accessory
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge variant="brand" size="sm">
            {accessory.category || 'Accessory'}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'In Stock' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={accessoryUrl} className="block group/title">
            <h3 className="text-sm sm:text-base font-bold text-charcoal-950 group-hover/title:text-brand-700 transition-colors line-clamp-2 leading-snug">
              {accessory.name}
            </h3>
          </Link>

          {accessory.description && (
            <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed font-medium">
              {accessory.description}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-charcoal-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-black text-charcoal-950">
              {formatPrice(accessory.price)}
            </span>
            {accessory.previousPrice && accessory.previousPrice > accessory.price && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatPrice(accessory.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={accessoryUrl} className="w-full">
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
