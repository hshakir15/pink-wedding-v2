import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Safina & Ghalib — Nikah Invitation',
  description: 'Join us in celebrating the holy Nikah union of Safina & Ghalib at Royal Heritage Palace.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Amiri:wght@400;700&family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Great+Vibes&family=Montserrat:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Pinyon+Script&family=Parisienne&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080d18] text-slate-100 font-serif antialiased overflow-x-hidden selection:bg-gold-500 selection:text-night-950">
        {children}
      </body>
    </html>
  );
}
