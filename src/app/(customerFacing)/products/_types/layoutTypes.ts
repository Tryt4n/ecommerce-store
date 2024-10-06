export type ProductsLayout = "grid" | "list";

export type ProductsPerPage = 12 | 24 | 36;

export const defaultProductsLayout: ProductsLayout = "grid";

export const defaultProductsPerPage: ProductsPerPage = 12 as const;

export const productsPerPageValues: ProductsPerPage[] = Array.from(
  new Set<ProductsPerPage>([12, 24, 36])
);
