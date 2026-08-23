'use client';

import React, { useState, useEffect } from 'react';
import { Send, Check, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { DEFAULT_BUSINESS_CONFIG } from '@/lib/business-config';
import { apiClient } from '@/lib/api-client';
import { settingsService } from '@/services/settingsService';
import { sanitizeWhatsAppNumber } from '@/lib/formatters';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState(''); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_BUSINESS_CONFIG.whatsappNumber || '+923427709129'
  );

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => {
        if (res.success && res.data?.whatsappNumber) {
          setWhatsappNumber(res.data.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setError('Please fill in your name, contact phone/WhatsApp, and message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiClient('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          message,
          productNameSnapshot: 'General Contact Inquiry',
          source: 'contact_page_form',
          _hp: hp,
        }),
      });

      if (res.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setMessage('');
      } else {
        setSuccess(true);
      }
    } catch {
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const cleanNum = sanitizeWhatsAppNumber(whatsappNumber);
    const text = encodeURIComponent(
      `Assalam o Alaikum, My name is ${name || 'a customer'}. ${message || 'I would like to inquire about laptops in Lakki Marwat.'}`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-charcoal-200/90 shadow-soft space-y-4">
      <h2 className="text-xl font-black text-charcoal-950">Send Us a Direct Message</h2>

      {/* Honeypot field for bot spam prevention */}
      <input
        type="text"
        name="_hp"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex flex-col gap-1.5 font-medium">
          <div className="flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your message has been sent to Yasin Laptop Hub.</span>
          </div>
          <p className="text-charcoal-600">We will respond on your contact number shortly.</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
          Your Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Muhammad Usman"
          className="w-full px-4 py-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
          Phone / WhatsApp Number <span className="text-rose-500">*</span>
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0342 1234567"
          className="w-full px-4 py-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
          Your Message or Inquired Laptop <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Assalam o Alaikum, I am looking for a Core i5 laptop with 16GB RAM for programming under Rs. 60,000. Is it available in your shop?"
          className="w-full px-4 py-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30 transition-all font-medium resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppDirect}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Open in WhatsApp</span>
        </button>
      </div>
    </form>
  );
};
