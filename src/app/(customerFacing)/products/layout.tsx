import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
