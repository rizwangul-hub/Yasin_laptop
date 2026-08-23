import type { Metadata } from 'next';
import './globals.css';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Yasin Laptop Hub',
  description: 'Inventory, Category, Brand and Inquiry management system for Yasin Laptop Hub.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-400 selection:text-charcoal-950 bg-warm-bg text-charcoal-900 font-sans">
        <AuthProvider>
          <AdminLayout>{children}</AdminLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
