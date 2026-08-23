import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { Card } from '../ui/Card';

export const ContactPreview: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = React.useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );

  React.useEffect(() => {
    import('@/services/settingsService').then(({ settingsService }) => {
      settingsService.getSettings().then((res) => {
        if (res.success && res.data?.whatsappNumber) {
          setWhatsappNumber(res.data.whatsappNumber);
        }
      }).catch(() => {});
    });
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '923427709129';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Assalam o Alaikum, I would like to visit or contact Yasin Laptop Hub.')}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Location */}
        <Card className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Store Location</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {DEFAULT_BUSINESS_CONFIG.address.city}, {DEFAULT_BUSINESS_CONFIG.address.province}, Pakistan
            </p>
          </div>
          {DEFAULT_BUSINESS_CONFIG.googleMapsUrl ? (
            <a
              href={DEFAULT_BUSINESS_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium pt-1"
            >
              <span>Open on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-500 block pt-1">
              Maps link configurable via admin settings
            </span>
          )}
        </Card>

        {/* Owner & WhatsApp */}
        <Card className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Direct Assistance</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Managed by <strong className="text-slate-300">{DEFAULT_BUSINESS_CONFIG.ownerName}</strong>
            </p>
          </div>
          <a
            href={whatsappUrl}
            target={DEFAULT_BUSINESS_CONFIG.whatsappNumber ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1"
          >
            <span>Message on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Card>

        {/* Business Hours */}
        <Card className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Working Hours</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {DEFAULT_BUSINESS_CONFIG.openingHours || 'Monday – Saturday: Regular Store Hours'}
            </p>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">
            WhatsApp inquiries accepted 7 days a week
          </span>
        </Card>
      </div>
    </section>
  );
};
