import './globals.css';
import Shell from '@/components/shell';

export const metadata = {
  title: { default: 'Packaging Catalog', template: '%s | Packaging Catalog' },
  description: 'Boxes & packaging — public catalog',
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Shell>{children}</Shell></body>
    </html>
  );
}