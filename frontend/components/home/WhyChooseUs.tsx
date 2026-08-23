import React from 'react';
import { ShieldCheck, CheckCircle2, Truck, RefreshCw, Headphones } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Quality-Focused Selection',
    description: 'We source dependable laptops and inspect hardware, battery health, and display condition thoroughly.',
  },
  {
    icon: CheckCircle2,
    title: 'Checking Warranty Support',
    description: 'Every purchased unit comes with checking warranty for confidence and peace of mind.',
  },
  {
    icon: Headphones,
    title: 'Direct WhatsApp Video Checks',
    description: 'Request live video demos or detailed high-res photos of the exact laptop unit before purchase.',
  },
  {
    icon: RefreshCw,
    title: 'Laptops & Accessories Together',
    description: 'Get original chargers, padded laptop backpacks, stands, and SSD upgrades in one store.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
            Store Values &amp; Trust
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Why Choose Yasin Laptop Hub?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Committed to providing inspected computing hardware and honest advice for work and university students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {REASONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
