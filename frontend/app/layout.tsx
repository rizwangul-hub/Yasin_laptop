import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { SITE_URL, SEO_CONFIG, generateLocalBusinessJsonLd, generateWebSiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: '%s | Yasin Laptop Hub',
  },
  description: SEO_CONFIG.defaultDescription,
  authors: [{ name: SEO_CONFIG.ownerName }],
  creator: SEO_CONFIG.ownerName,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    url: SITE_URL,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: SEO_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Yasin Laptop Hub Lakki Marwat Storefront',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [SEO_CONFIG.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ywPBhptvNvklv1A9JFLg77JOIiucIVkoVNd3_fERWCU',
  },
  icons: {
    icon: [
      { url: '/image/logo.jpg', type: 'image/jpeg' },
      { url: '/logo.jpg', type: 'image/jpeg' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/image/logo.jpg'],
    apple: [
      { url: '/image/logo.jpg', type: 'image/jpeg' },
      { url: '/apple-touch-icon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = generateLocalBusinessJsonLd();
  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ywPBhptvNvklv1A9JFLg77JOIiucIVkoVNd3_fERWCU" />
        <link rel="icon" href="/image/logo.jpg" type="image/jpeg" sizes="any" />
        <link rel="shortcut icon" href="/image/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/image/logo.jpg" />
        <link rel="image_src" href="/image/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-warm-bg text-charcoal-900 antialiased selection:bg-brand-400 selection:text-charcoal-950 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <FloatingWhatsApp />
        <Footer />
      </body>
    </html>
  );
}
