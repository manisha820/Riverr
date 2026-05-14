import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Riverr | AI Organizational Intelligence OS",
    template: "%s | Riverr"
  },
  description: "The enterprise knowledge operating system. Riverr transforms conversations into operational memory, automated workflows, and strategic insight.",
  keywords: ["AI meeting intelligence", "organizational memory", "workflow automation", "semantic search", "knowledge graph"],
  authors: [{ name: "Riverr Intelligence Systems" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riverr.ai",
    siteName: "Riverr",
    title: "Riverr | AI Organizational Intelligence OS",
    description: "Your organization, intelligently mapped. Persistent memory and autonomous workflows for modern teams.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Riverr Intelligence OS" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Riverr | AI Organizational Intelligence OS",
    description: "Persistent memory and autonomous workflows for modern teams.",
    images: ["/og-image.png"],
    creator: "@riverr_ai"
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
