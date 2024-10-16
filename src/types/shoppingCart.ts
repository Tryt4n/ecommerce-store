import type { Product } from "@prisma/client";

export type ShoppingCart = ShoppingCartItem[];

type ShoppingCartItem = {
  quantity: number;
} & Pick<Product, "id" | "name" | "priceInCents"> & {
    thumbnailUrl: string;
  };
