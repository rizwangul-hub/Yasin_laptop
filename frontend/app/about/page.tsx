import React from 'react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { ShieldCheck, Laptop, Award, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Yasin Laptop Hub | Owner Yasin Wahab',
  description: 'Learn about Yasin Laptop Hub, located in Lakki Marwat, KPK, Pakistan. Providing inspected laptops and verified computing hardware.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          Our Story &amp; Commitment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Yasin Laptop Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Providing genuine inspected business laptops, student computers, and accessories with transparency and dedicated support.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Business Leadership</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Founded and managed by <strong className="text-white">{DEFAULT_BUSINESS_CONFIG.ownerName}</strong>, 
          Yasin Laptop Hub is committed to bringing high standard, thoroughly-tested laptops to customers across 
          Lakki Marwat, Khyber Pakhtunkhwa, and throughout Pakistan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-brand-400">
              <Award className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-white">Checked Quality</h3>
            </div>
            <p className="text-xs text-slate-400">
              Every unit is tested for battery health, keyboard responsiveness, display clarity, thermals, and port integrity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-brand-400">
              <MapPin className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-white">Local Hub</h3>
            </div>
            <p className="text-xs text-slate-400">
              Conveniently located in {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan with direct WhatsApp support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
