import React from 'react';
import { ShieldCheck, Grid, Tag, MessageCircle, Truck } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: '100% Quality Checked',
    description: 'Hardware, screen & battery tested before shipment',
  },
  {
    icon: Tag,
    title: 'Fair & Transparent Prices',
    description: 'Best rates in PKR with 1-month checking warranty',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Safe packaging to Lakki Marwat, KPK & across Pakistan',
  },
  {
    icon: MessageCircle,
    title: 'Direct WhatsApp Support',
    description: 'Request live photos, video tests & quick guidance',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <div className="border-y border-charcoal-200/80 bg-white py-6 sm:py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-charcoal-50/70 border border-charcoal-200/80 hover:border-brand-400/80 hover:bg-brand-50/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300/80 text-brand-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
