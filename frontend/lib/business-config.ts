import { IBusinessSettings } from '@/types';

export interface IStoreBranch {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  tag: string;
  phone: string;
  whatsapp: string;
  timings: string;
  mapsUrl?: string;
  pageHref: string;
  isMain?: boolean;
}

export const STORE_BRANCHES: IStoreBranch[] = [
  {
    id: 'lakki-marwat',
    name: 'Lakki Marwat (Main Branch & Warehouse)',
    city: 'Lakki Marwat',
    province: 'Khyber Pakhtunkhwa',
    address: 'Main Bazaar, Lakki Marwat, Khyber Pakhtunkhwa, Pakistan',
    tag: 'Main Store & Head Office',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 9:00 AM – 9:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Lakki+Marwat+Main+Bazaar',
    pageHref: '/laptop-shop-lakki-marwat',
    isMain: true,
  },
  {
    id: 'peshawar',
    name: 'Peshawar Branch',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    address: 'Saddar / University Road Computer Market, Peshawar, KPK, Pakistan',
    tag: 'KPK Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Peshawar+Computer+Market',
    pageHref: '/laptops-in-peshawar',
    isMain: false,
  },
  {
    id: 'sargodha',
    name: 'Sargodha Branch',
    city: 'Sargodha',
    province: 'Punjab',
    address: 'Kutchery Road / Trust Plaza, Computer Market, Sargodha, Punjab, Pakistan',
    tag: 'Punjab Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Sargodha+Computer+Market',
    pageHref: '/laptops-in-sargodha',
    isMain: false,
  },
];

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
    'Premium laptop store with physical branches in Lakki Marwat, Peshawar, and Sargodha, providing genuine laptops, Chromebooks, and accessories across Pakistan.',
  openingHours: 'Monday – Saturday: 9:00 AM – 9:00 PM',
};

export const SITE_METADATA = {
  title: 'Yasin Laptop Hub | Quality Laptops in Lakki Marwat, Peshawar & Sargodha',
  description:
    'Explore high quality laptops, chromebooks, and accessories at Yasin Laptop Hub with branches in Lakki Marwat, Peshawar, and Sargodha. Owned and managed by Yasin Wahab.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app',
  owner: 'Yasin Wahab',
};
