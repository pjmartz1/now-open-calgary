import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "New Businesses Calgary 2025 | Latest Restaurant & Shop Openings | Now Open Calgary",
    template: "%s | Now Open Calgary"
  },
  description: "Find 500+ new businesses opening in Calgary 2025! Fresh restaurants, shops & services with addresses, hours & reviews. Updated daily. Your #1 Calgary business directory.",
  keywords: ["new businesses calgary", "calgary business directory", "new restaurants calgary 2025", "latest calgary openings", "calgary new shops", "YYC business openings", "fresh businesses calgary", "new services calgary", "calgary restaurant openings", "newest stores calgary"],
  authors: [{ name: "Now Open Calgary" }],
  creator: "Now Open Calgary",
  publisher: "Now Open Calgary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.nowopencalgary.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "New Businesses Calgary 2025 | Latest Restaurant & Shop Openings",
    description: "Find 500+ new businesses opening in Calgary 2025! Fresh restaurants, shops & services with addresses, hours & reviews. Updated daily.",
    url: 'https://www.nowopencalgary.ca',
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
    title: "New Businesses Calgary 2025 | Latest Restaurant & Shop Openings",
    description: "Find 500+ new businesses opening in Calgary 2025! Fresh restaurants, shops & services. Updated daily.",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
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
        
        {/* Geo Meta Tags for Local SEO */}
        <meta name="geo.region" content="CA-AB" />
        <meta name="geo.placename" content="Calgary" />
        <meta name="geo.position" content="51.0447,-114.0719" />
        <meta name="ICBM" content="51.0447,-114.0719" />
        <meta name="DC.title" content="Now Open Calgary - New Business Directory" />
        <meta name="DC.subject" content="Calgary Business Directory, New Businesses, Restaurants, Retail, Services" />
        <meta name="DC.description" content="Discover new businesses opening in Calgary, Alberta, Canada. Real-time business directory updated daily." />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.publisher" content="Now Open Calgary" />
        <meta name="DC.coverage" content="Calgary, Alberta, Canada" />
        <meta name="DC.type" content="Service" />
        <meta name="DC.language" content="en" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
