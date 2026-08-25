export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://yasin-laptop-hub.vercel.app'
).replace(/\/$/, '');

export const SEO_CONFIG = {
  siteName: 'Yasin Laptop Hub',
  businessName: 'Yasin Laptop Hub',
  ownerName: 'Yasin Wahab',
  siteUrl: SITE_URL,
  defaultTitle: 'Yasin Laptop Hub | Quality Laptops & Chromebooks in Lakki Marwat',
  defaultDescription:
    'Explore genuine business laptops, Chromebooks, and original accessories at Yasin Laptop Hub in Lakki Marwat, KPK, Pakistan. Checking warranty and WhatsApp inquiries.',
  defaultOgImage: `${SITE_URL}/image/weblogo.jpg`,
  locale: 'en_PK',
  currency: 'PKR',
  contact: {
    city: 'Lakki Marwat',
    province: 'Khyber Pakhtunkhwa',
    country: 'Pakistan',
    countryCode: 'PK',
    addressLocality: 'Lakki Marwat',
    addressRegion: 'Khyber Pakhtunkhwa',
    postalCode: '28420',
  },
};

export const getCanonicalUrl = (path = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

export const generateProductJsonLd = (product: any) => {
  const brandName = typeof product.brand === 'object' && product.brand !== null ? product.brand.name : product.brand || 'Laptop';
  const imageUrl = product.images?.[0]?.url || `${SITE_URL}/image/weblogo.jpg`;
  const inStock = product.stockStatus === 'available';

  let conditionSchema = 'https://schema.org/UsedCondition';
  if (product.condition === 'new') {
    conditionSchema = 'https://schema.org/NewCondition';
  } else if (product.condition === 'refurbished') {
    conditionSchema = 'https://schema.org/RefurbishedCondition';
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription || `${product.name} available at Yasin Laptop Hub`,
    image: [imageUrl],
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/laptops/${product.slug}`,
      priceCurrency: 'PKR',
      price: product.price,
      itemCondition: conditionSchema,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Yasin Laptop Hub',
      },
    },
  };
};

export const generateLocalBusinessJsonLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'Yasin Laptop Hub',
    image: `${SITE_URL}/image/weblogo.jpg`,
    logo: `${SITE_URL}/image/weblogo.jpg`,
    url: SITE_URL,
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+923427709129',
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Bazaar',
      addressLocality: 'Lakki Marwat',
      addressRegion: 'Khyber Pakhtunkhwa',
      postalCode: '28420',
      addressCountry: 'PK',
    },
    founder: {
      '@type': 'Person',
      name: 'Yasin Wahab',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Lakki Marwat, Khyber Pakhtunkhwa',
    },
  };
};

export const generateBreadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
};

export const generateWebSiteJsonLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yasin Laptop Hub',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/laptops?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};
