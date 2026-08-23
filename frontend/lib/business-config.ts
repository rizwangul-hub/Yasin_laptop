import { IBusinessSettings } from '@/types';

export const DEFAULT_BUSINESS_CONFIG: IBusinessSettings = {
  businessName: 'Yasin Laptop Hub',
  ownerName: 'Yasin Wahab',
  logoUrl: '',
  tagline: 'Quality Laptops • Chromebooks • Accessories',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+923427709129',
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '03427709129',
  email: 'info@yasinlaptophub.com',
  address: {
    street: 'Main Bazaar',
    city: 'Lakki Marwat',
    district: 'Lakki Marwat',
    province: 'Khyber Pakhtunkhwa',
    country: 'Pakistan',
  },
  googleMapsUrl: '',
  socialLinks: {
    facebook: '',
    instagram: 'https://www.instagram.com/yasinwahab6',
    tiktok: 'https://www.tiktok.com/@yasinlaptopslakkimarwat',
    youtube: '',
  },
  businessDescription:
    'Premium laptop store providing genuine laptops, chromebooks, and accessories in Lakki Marwat, KPK, Pakistan.',
  openingHours: 'Monday – Saturday: 9:00 AM – 9:00 PM',
};

export const SITE_METADATA = {
  title: 'Yasin Laptop Hub | Quality Laptops & Accessories in Lakki Marwat',
  description:
    'Explore high quality laptops, chromebooks, and accessories at Yasin Laptop Hub in Lakki Marwat, Khyber Pakhtunkhwa. Owned and managed by Yasin Wahab.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app',
  owner: 'Yasin Wahab',
};
