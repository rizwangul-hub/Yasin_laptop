import React from 'react';
import { ShieldCheck, Grid, Tag, MessageCircle } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Quality Checked Laptops',
    description: 'Hardware & battery diagnostics performed on every unit',
  },
  {
    icon: Grid,
    title: 'Multiple Categories',
    description: 'Business, Student, Chromebooks & Heavy Workstations',
  },
  {
    icon: Tag,
    title: 'Affordable & Transparent',
    description: 'Competitive prices in Pakistani Rupees with condition ratings',
  },
  {
    icon: MessageCircle,
    title: 'Direct WhatsApp Support',
    description: 'Instant photos, video checks and direct recommendations',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <div className="border-y border-slate-800 bg-slate-950/60 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-600/15 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
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
