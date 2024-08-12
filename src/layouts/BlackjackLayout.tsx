'use client';
import { Metadata } from 'next';
import { DM_Sans, Frank_Ruhl_Libre } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';

import { siteConfig } from '@/constant/config';

export const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});
export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function BlackjackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${frankRuhlLibre.variable} ${dmSans.variable}`}>
      <body className='size-screen'>{children}</body>
    </html>
  );
}
