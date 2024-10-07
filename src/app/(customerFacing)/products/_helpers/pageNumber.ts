import { defaultProductsPerPage } from "../_types/layoutTypes";

export function getLastPageNumber(
  productsCount?: number | null,
  value?: string | number | null
) {
  if (!productsCount) return null;

  return Math.ceil(productsCount / (Number(value) || defaultProductsPerPage));
}
