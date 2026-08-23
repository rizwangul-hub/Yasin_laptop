import React from 'react';
import { ShieldCheck, Award, MessageCircle, MapPin, Zap, CheckCircle2 } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: '1-Month Checking Warranty',
    subtitle: 'Full testing & verification',
  },
  {
    icon: Award,
    title: 'Original Chargers Included',
    subtitle: 'Authentic wattage adapters',
  },
  {
    icon: MessageCircle,
    title: 'Live Video Testing',
    subtitle: 'Inspect on WhatsApp first',
  },
  {
    icon: MapPin,
    title: 'Local Shop Lakki Marwat',
    subtitle: 'Main Bazaar, KPK & Delivery',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {TRUST_POINTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-charcoal-200/90 shadow-xs hover:border-brand-500/80 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-900" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-charcoal-950 truncate leading-snug">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-charcoal-500 font-medium truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
