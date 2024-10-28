import React from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { formatCurrency } from "@/lib/formatters";
import ImageThumbnail from "@/components/ImageThumbnail";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, X } from "lucide-react";

type ShoppingCartListProps = {
  containerClassNames?: string;
  thumbnailSize?: number;
};

export default function ShoppingCartList({
  containerClassNames,
  thumbnailSize = 100,
}: ShoppingCartListProps) {
  const {
    shoppingCart,
    deleteProductFromShoppingCart,
    changeProductQuantityInShoppingCart,
  } = useShoppingCart();
  const { width } = useWindowSize();

  return (
    <ul
      className={`max-w-full font-medium${containerClassNames ? ` ${containerClassNames}` : ""}`}
    >
      {shoppingCart?.map((item, index) => {
        const { id, name, priceInCents, quantity, thumbnailUrl } = item;

        return (
          <li key={id}>
            <section className="flex flex-row items-center justify-end gap-x-2 sm:gap-x-4">
              <div className="relative flex flex-grow flex-row items-center gap-2 text-sm">
                <figure
                  className="flex flex-grow flex-row items-center gap-2"
                  style={{
                    width:
                      width < 500
                        ? "calc(100% + 40px + 0.5rem)" // 100% + size of the delete button + gap
                        : "w-auto",
                  }}
                >
                  <ImageThumbnail
                    src={thumbnailUrl}
                    alt={name}
                    width={thumbnailSize}
                    height={thumbnailSize}
                    containerClassNames="relative w-full h-full [&>img]:object-contain [&>img]:object-center"
                    containerStyles={{
                      width: thumbnailSize,
                      height: thumbnailSize,
                    }}
                    thumbnailContainerClassNames="bg-muted"
                    customRawSize={thumbnailSize}
                  />
                  <hgroup className="flex flex-grow flex-row flex-wrap items-center justify-between gap-x-2 sm:gap-x-4">
                    <figcaption>
                      <h3>{name}</h3>
                    </figcaption>
                    <p>{formatCurrency((priceInCents * quantity) / 100)}</p>
                  </hgroup>
                </figure>

                <div className="flex flex-row-reverse items-center gap-2">
                  <p
                    id={`quantity_${index}`}
                    className="font-semibold"
                    aria-label="Quantity"
                    aria-live="polite"
                  >
                    x{quantity}
                  </p>
                  <div className="flex flex-col overflow-hidden rounded-md border">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-6 w-6 rounded-none border-0 p-0"
                      aria-controls={`quantity_${index}`}
                      onClick={() =>
                        changeProductQuantityInShoppingCart(id, "increment")
                      }
                    >
                      <span className="sr-only">Increase quantity by 1</span>
                      <ChevronUp size={16} />
                    </Button>
                    <hr />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-6 w-6 rounded-none border-0 p-0"
                      aria-controls={`quantity_${index}`}
                      onClick={() =>
                        changeProductQuantityInShoppingCart(id, "decrement")
                      }
                    >
                      <span className="sr-only">Decrease quantity by 1</span>
                      <ChevronDown size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteProductFromShoppingCart(id)}
              >
                <X color="#EF4444" />
                <span className="sr-only">Remove Product</span>
              </Button>
            </section>

            {index !== shoppingCart.length - 1 && (
              <Separator className="my-2" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
