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
  const mainImage = accessory.images?.find((img: IProductImage) => img.isPrimary || img.isMain) || accessory.images?.[0];
  const isAvailable = accessory.stockStatus === 'available';

  const accessoryUrl = `/accessories?item=${accessory.slug}`;

  const whatsappInquiryUrl = buildWhatsAppUrl(DEFAULT_BUSINESS_CONFIG.whatsappNumber, {
    name: accessory.name,
    condition: accessory.condition,
    price: accessory.price,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}${accessoryUrl}`,
  });

  return (
    <Card hover className="flex flex-col h-full overflow-hidden bg-slate-900/80 border-slate-800">
      {/* Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-slate-950/60 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        {mainImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage.url}
            alt={mainImage.alt || mainImage.altText || accessory.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
            <Layers className="w-10 h-10" />
            <span className="text-[10px] font-medium tracking-wider uppercase">Genuine Accessory</span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5">
          <Badge variant="brand" size="sm">
            {accessory.category || 'Accessory'}
          </Badge>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'Available' : 'Sold Out'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={accessoryUrl} className="block group">
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2">
              {accessory.name}
            </h3>
          </Link>

          {accessory.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {accessory.description}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-bold text-white">
              {formatPrice(accessory.price)}
            </span>
            {accessory.previousPrice && accessory.previousPrice > accessory.price && (
              <span className="text-xs text-slate-500 line-through">
                {formatPrice(accessory.previousPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={accessoryUrl} className="w-full">
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
