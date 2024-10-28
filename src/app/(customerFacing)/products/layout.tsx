import ProductsContextProvider from "./_context/ProductsContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProductsContextProvider>{children}</ProductsContextProvider>;
}
