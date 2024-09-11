import type { Product as DBProduct, Order as DBOrder } from "@prisma/client";

export type Order = {
  id: DBOrder["id"];
  createdAt: DBOrder["createdAt"];
  pricePaidInCents: DBOrder["pricePaidInCents"];
};

export type Product = {
  name: DBProduct["name"];
  imagePath: DBProduct["imagePath"];
  description: DBProduct["description"];
};
