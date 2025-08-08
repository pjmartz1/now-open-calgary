import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Now Open Calgary - Discover New Businesses in Calgary",
    template: "%s | Now Open Calgary"
  },
  description: "Discover what's new in Calgary! Find the newest businesses, restaurants, shops and services opening their doors. Your complete Calgary business directory for fresh openings.",
  keywords: ["new in calgary", "new businesses calgary", "calgary business directory", "newest restaurants calgary", "new shops calgary", "new services calgary", "what's new calgary", "calgary openings"],
  authors: [{ name: "Now Open Calgary" }],
  creator: "Now Open Calgary",
  publisher: "Now Open Calgary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nowopencalgary.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Now Open Calgary - Discover New Businesses in Calgary",
    description: "Discover what's new in Calgary! Find the newest businesses, restaurants, shops and services opening their doors. Your complete Calgary business directory for fresh openings.",
    url: 'https://nowopencalgary.ca',
    siteName: 'Now Open Calgary',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Now Open Calgary - Discover New Businesses in Calgary',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Now Open Calgary - Discover New Businesses in Calgary",
    description: "Discover what's new in Calgary! Find the newest businesses, restaurants, shops and services opening their doors. Your complete Calgary business directory for fresh openings.",
    images: ['/og-image.svg'],
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
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D03HYCQ427"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D03HYCQ427');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
