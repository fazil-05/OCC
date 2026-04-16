import type { Metadata } from "next";
import "./globals.css";
import { Inter, Cormorant_Garamond } from "next/font/google"; // ADDED: High-end editorial serif
import { Toaster } from "sonner";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { OCC_BRAND_ICON } from "@/lib/brand";

// Added professional weights for Inter
const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-inter' 
});

// Added a Premium Serif for editorial accents
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "OCC — Off Campus Clubs for Gen Z",
  description: "Off Campus Clubs connects students across colleges through clubs, gigs, events, and premium scroll-driven experiences.",
  metadataBase: new URL("https://www.offcampusclub.com"), // Setting this helps with absolute image paths
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: OCC_BRAND_ICON, type: "image/png", sizes: "512x512" }],
    shortcut: OCC_BRAND_ICON,
    apple: [{ url: OCC_BRAND_ICON, type: "image/png", sizes: "512x512" }],
  },
  openGraph: {
    title: "OCC — Off Campus Clubs for Gen Z",
    description: "The ultimate platform for college student clubs. Join clubs, host events, and build your network.",
    // Use a 1200×630 PNG here when available; SVG is not ideal for all OG consumers.
    images: [{ url: OCC_BRAND_ICON, width: 512, height: 512, alt: "OCC" }],
    type: "website",
    url: "https://www.offcampusclub.com",
  },
  twitter: {
    card: "summary",
    title: "OCC — Off Campus Clubs for Gen Z",
    description: "The ultimate platform for college student clubs.",
    images: [OCC_BRAND_ICON],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_FRAMES_CDN_BASE && (
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_FRAMES_CDN_BASE}
          />
        )}
        {process.env.NEXT_PUBLIC_FRAMES_CDN_BASE && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_FRAMES_CDN_BASE}
            crossOrigin="anonymous"
          />
        )}
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <PerformanceProvider />
        <Toaster position="top-center" richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
