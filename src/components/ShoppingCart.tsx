"use client";

import React, { type ComponentProps } from "react";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { formatCurrency } from "@/lib/formatters";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import ImageThumbnail from "./ImageThumbnail";
import { ChevronDown, ChevronUp, ShoppingBasketIcon, X } from "lucide-react";

type ShoppingCartProps = {
  buttonProps?: ComponentProps<typeof Button>;
  iconProps?: ComponentProps<typeof ShoppingBasketIcon>;
};

export default function ShoppingCart({
  buttonProps,
  iconProps,
}: ShoppingCartProps) {
  const {
    shoppingCart,
    deleteProductFromShoppingCart,
    changeProductQuantityInShoppingCart,
  } = useShoppingCart();

  return (
    <div>
      <HoverCard closeDelay={500}>
        <HoverCardTrigger asChild>
          <Button
            type="button"
            variant="default"
            className="transition-opacity hover:opacity-50"
            aria-label="Hover to view shopping cart"
            {...buttonProps}
          >
            <ShoppingBasketIcon {...iconProps} />
            <span className="sr-only">Shopping Cart</span>
          </Button>
        </HoverCardTrigger>

        <HoverCardContent className="w-full" collisionPadding={20}>
          {shoppingCart && shoppingCart.length >= 1 ? (
            <ul className="max-h-[268px] max-w-full overflow-y-auto font-medium">
              {shoppingCart.map((item, index) => {
                const { id, name, priceInCents, quantity, thumbnailUrl } = item;

                return (
                  <li key={id}>
                    <div className="flex flex-row items-center justify-between gap-4">
                      <div className="relative flex flex-grow flex-row items-center gap-2 text-sm">
                        <ImageThumbnail
                          src={thumbnailUrl}
                          alt={name}
                          width={50}
                          height={50}
                          containerClassNames="relative w-full h-full"
                          containerStyles={{ width: 50, height: 50 }}
                          customRawSize={50}
                        />
                        <p className="flex-grow">{name}</p>
                        <p>{formatCurrency((priceInCents * quantity) / 100)}</p>

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
                                changeProductQuantityInShoppingCart(
                                  id,
                                  "increment"
                                )
                              }
                            >
                              <span className="sr-only">
                                Increase quantity by 1
                              </span>
                              <ChevronUp size={16} />
                            </Button>
                            <hr />
                            <Button
                              type="button"
                              variant="outline"
                              className="h-6 w-6 rounded-none border-0 p-0"
                              aria-controls={`quantity_${index}`}
                              onClick={() =>
                                changeProductQuantityInShoppingCart(
                                  id,
                                  "decrement"
                                )
                              }
                            >
                              <span className="sr-only">
                                Decrease quantity by 1
                              </span>
                              <ChevronDown size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        className=""
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProductFromShoppingCart(id)}
                      >
                        <X color="#EF4444" />
                      </Button>
                    </div>

                    {index !== shoppingCart.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="my-2 text-pretty text-center text-sm">
              The shopping cart is empty.
            </p>
          )}

          {shoppingCart && shoppingCart.length >= 1 && (
            <Button href="/purchase" className="mt-4 w-full">
              Go to Shopping Cart
            </Button>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
