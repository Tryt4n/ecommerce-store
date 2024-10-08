import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/layout/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        url: "/dark-icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/light-icon.png",
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
