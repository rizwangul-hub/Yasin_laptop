import React from 'react';
import { Search, SlidersHorizontal, CheckSquare, MessageCircle } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Find Your Laptop',
    description: 'Filter by work, study, brand (HP, Dell, Lenovo) or budget.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Compare Specifications',
    description: 'Check processor, RAM, SSD capacity and battery health.',
    icon: SlidersHorizontal,
  },
  {
    step: '03',
    title: 'Check Condition & Price',
    description: 'Review transparent condition grading and clear price in PKR.',
    icon: CheckSquare,
  },
  {
    step: '04',
    title: 'Ask on WhatsApp',
    description: 'Get instant live photos, demo videos, and confirm delivery.',
    icon: MessageCircle,
  },
];

export const CustomerJourney: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          How It Works
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Simple 4-Step Shopping Experience
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          From finding the right specs to getting live confirmation via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-700 select-none">
                  {item.step}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
