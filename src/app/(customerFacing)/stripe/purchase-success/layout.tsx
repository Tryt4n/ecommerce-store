import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase successful",
  description: "Your purchase was successful",
};

export default function PurchaseSuccessPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
