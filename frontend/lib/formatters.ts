import { IProduct } from '@/types';

/**
 * Clean & sanitize WhatsApp number, defaulting to official admin WhatsApp 923427709129
 */
export function sanitizeWhatsAppNumber(num?: string | null): string {
  if (!num) return '923427709129';
  const clean = num.replace(/[^0-9]/g, '');
  if (!clean || clean.length < 10 || clean.includes('0000000') || clean === '923000000000') {
    return '923427709129';
  }
  if (clean.startsWith('03')) {
    return `92${clean.slice(1)}`;
  }
  if (clean.startsWith('3') && clean.length === 10) {
    return `92${clean}`;
  }
  return clean;
}

/**
 * Format a number as Pakistani Rupees (PKR)
 * Example: formatPrice(45000) -> "Rs. 45,000"
 */
export function formatPrice(price?: number | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Price on Inquiry';
  }
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

/**
 * Build phone deep-link safely
 */
export function buildPhoneUrl(phoneNumber?: string): string {
  const cleanNumber = (phoneNumber || '03427709129').replace(/[^0-9+]/g, '');
  return `tel:${cleanNumber}`;
}

/**
 * Build rich structured WhatsApp message for a product
 */
export function buildProductWhatsAppMessage(product: IProduct, siteUrl?: string): string {
  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : product.brand;
  const isSold = product.stockStatus === 'sold_out';

  const productUrl = siteUrl
    ? `${siteUrl.replace(/\/$/, '')}/laptops/${product.slug}`
    : typeof window !== 'undefined'
    ? `${window.location.origin}/laptops/${product.slug}`
    : '';

  if (isSold) {
    let msg = `Assalam o Alaikum,\nI saw that "${product.name}" is currently sold out at Yasin Laptop Hub.`;
    msg += `\nCould you please let me know if similar models with these specs or new shipments are available?`;
    if (productUrl) {
      msg += `\n\nProduct Link:\n${productUrl}`;
    }
    return msg;
  }

  let msg = `Assalam o Alaikum,\nI am interested in this laptop from Yasin Laptop Hub:\n\n`;
  msg += `Product: ${product.name}\n`;

  if (brandName) msg += `Brand: ${brandName}\n`;
  if (product.specs?.processor) msg += `Processor: ${product.specs.processor}\n`;
  if (product.specs?.generation) msg += `Generation: ${product.specs.generation}\n`;
  if (product.specs?.ram) msg += `RAM: ${product.specs.ram}\n`;
  if (product.specs?.storage) {
    msg += `Storage: ${product.specs.storage}${
      product.specs.storageType ? ` ${product.specs.storageType}` : ''
    }\n`;
  }
  if (product.specs?.displaySize) msg += `Display: ${product.specs.displaySize}\n`;
  if (product.specs?.graphics) msg += `Graphics: ${product.specs.graphics}\n`;
  if (product.condition) msg += `Condition: ${product.condition.replace('-', ' ')}\n`;
  if (product.price) msg += `Price: ${formatPrice(product.price)}\n`;

  msg += `\nPlease provide more photos/demo details and availability.`;

  if (productUrl) {
    msg += `\n\nProduct Link:\n${productUrl}`;
  }

  return msg;
}

/**
 * Build encoded WhatsApp Web/App deep link for a product
 */
export function buildProductWhatsAppUrl(
  whatsappNumber?: string | null,
  product?: IProduct,
  siteUrl?: string
): string {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);
  if (!product) {
    const defaultMsg = encodeURIComponent(
      'Assalam o Alaikum, I would like to inquire about laptops at Yasin Laptop Hub.'
    );
    return `https://wa.me/${cleanNumber}?text=${defaultMsg}`;
  }
  const message = buildProductWhatsAppMessage(product, siteUrl);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generic helper for legacy inquiries
 */
export function buildWhatsAppUrl(
  whatsappNumber?: string | null,
  product?: { name: string; condition?: string; price?: number; url?: string }
): string {
  const cleanNumber = sanitizeWhatsAppNumber(whatsappNumber);

  if (!product) {
    return `https://wa.me/${cleanNumber}`;
  }

  let message = `Assalam o Alaikum, I am interested in "${product.name}"`;
  if (product.condition) {
    message += ` (${product.condition})`;
  }
  if (product.price) {
    message += ` listed for ${formatPrice(product.price)}`;
  }
  message += ' at Yasin Laptop Hub. Is it currently available?';

  if (product.url) {
    message += `\n\nLink: ${product.url}`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Utility for conditional className merging
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
