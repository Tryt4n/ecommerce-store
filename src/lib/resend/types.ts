import type {
  Product as DBProduct,
  Order as DBOrder,
  Image,
} from "@prisma/client";

export type Order = {
  id: DBOrder["id"];
  createdAt: DBOrder["createdAt"];
  pricePaidInCents: DBOrder["pricePaidInCents"];
};

export type Product = {
  name: DBProduct["name"];
  images: Pick<Image, "id" | "url">[];
  description: DBProduct["description"];
};
