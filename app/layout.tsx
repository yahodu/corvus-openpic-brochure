import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Corvus — Facial Analysis Suite',
  description:
    'Corvus is a facial analysis suite offering facial landmarks, detection, gender and age prediction, and SOTA face recognition models.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}