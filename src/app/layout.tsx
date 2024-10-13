import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/layout/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "E-commerce store",
  description: "This is a demo e-commerce store",
  authors: [{ name: "Marcin Jaczewski", url: "https://github.com/Tryt4n" }],
  creator: "Marcin Jaczewski",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    startupImage: ["/logo-black.svg", "/logo-white.svg"],
    title: "E-commerce store",
  },
  applicationName: "E-commerce store",
  category: "E-commerce",
  classification: "Demo E-commerce Store",
  generator: "Next.js",
  keywords: [
    "e-commerce",
    "demo store",
    "stripe payments",
    "resend emails",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "Vercel",
  ],
  openGraph: {
    type: "website",
    title: "E-commerce store",
    siteName: "E-commerce store",
    ttl: 604800, // 1 week
    description: "This is a demo e-commerce store",
    url: "https://ecommerce-project.site",
    images: [
      {
        url: "https://ecommerce-project.site/logo-black.svg",
        width: 128,
        height: 128,
        alt: "E-commerce store",
      },
      {
        url: "https://ecommerce-project.site/logo-white.svg",
        width: 128,
        height: 128,
        alt: "E-commerce store",
      },
    ],
  },
  publisher: "Marcin Jaczewski",
  referrer: "no-referrer",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "standard",
    "max-snippet": 100,
    noimageindex: true,
  },
  verification: {
    google: "PxJ5SGs_BInggwNN_oEFXD68uvd6YIUIMQkoz3vd__M",
    me: "https://github.com/Tryt4n",
  },
  icons: {
    icon: [
      {
        url: "/logo-black.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-white.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Navbar />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
