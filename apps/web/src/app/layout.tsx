import './globals.css';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { CookieConsent } from '@/components/cookie-consent';

export const metadata = {
  title: 'Catalog',
  description: 'Public catalog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}