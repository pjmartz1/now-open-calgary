import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Now Open Calgary - Discover New Businesses in Calgary",
    template: "%s | Now Open Calgary"
  },
  description: "Discover the newest businesses opening their doors in Calgary. From trendy cafes to innovative startups, find what's fresh in your city.",
  keywords: ["Calgary", "new businesses", "restaurants", "retail", "services", "local business", "Calgary business directory"],
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
    description: "Discover the newest businesses opening their doors in Calgary. From trendy cafes to innovative startups, find what's fresh in your city.",
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
    description: "Discover the newest businesses opening their doors in Calgary. From trendy cafes to innovative startups, find what's fresh in your city.",
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
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
