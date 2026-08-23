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
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-brand-600 selection:text-white bg-slate-950 text-slate-100">
        <AuthProvider>
          <AdminLayout>{children}</AdminLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
