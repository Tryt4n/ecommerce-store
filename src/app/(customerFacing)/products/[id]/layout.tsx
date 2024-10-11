import { getProduct } from "@/db/userData/products";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  return {
    title: product?.name,
    description: product?.description,
    category: product?.categories.join(", "),
    openGraph: {
      images: product?.images.map((image) => ({
        url: image.url,
      })),
    },
  };
}

export default function ProductPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
