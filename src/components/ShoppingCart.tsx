"use client";

import React, { useState, type ComponentProps } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
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
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);

  let isTouchDevice = false;
  // Check if the device is a touchable device. If it is, set the hover card to open on click
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    isTouchDevice = true;
  }

  const hoverCardCollisionPadding = width >= 500 ? 20 : 10; // 20px of space from the edge of the screen on each side of the hover card

  return (
    <HoverCard open={isTouchDevice ? isOpen : undefined} closeDelay={500}>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          href="/purchase"
          variant="default"
          className="transition-opacity hover:opacity-50"
          onClick={isTouchDevice ? () => setIsOpen(!isOpen) : undefined}
          aria-label={
            isTouchDevice
              ? isOpen
                ? "Click to close shopping cart."
                : "Click to show shopping cart."
              : "Hover to view shopping cart."
          }
          {...buttonProps}
        >
          <ShoppingBasketIcon
            {...iconProps}
            className={isTouchDevice && isOpen ? "text-green-500" : undefined}
          />
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        className={`sm:w-full`}
        style={{
          width: width - hoverCardCollisionPadding * 2,
          maxWidth: 500,
        }}
        collisionPadding={hoverCardCollisionPadding}
      >
        <article>
          <h2 className="sr-only">Shopping Cart</h2>

          {shoppingCart && shoppingCart.length >= 1 ? (
            <ul className="max-h-[268px] max-w-full overflow-y-auto font-medium">
              {shoppingCart.map((item, index) => {
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
                            width={50}
                            height={50}
                            containerClassNames="relative w-full h-full [&>img]:object-contain [&>img]:object-center"
                            containerStyles={{ width: 50, height: 50 }}
                            thumbnailContainerClassNames="bg-muted"
                            customRawSize={50}
                          />
                          <hgroup className="flex flex-grow flex-row flex-wrap items-center justify-between gap-x-2 sm:gap-x-4">
                            <figcaption>
                              <h3>{name}</h3>
                            </figcaption>
                            <p>
                              {formatCurrency((priceInCents * quantity) / 100)}
                            </p>
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
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProductFromShoppingCart(id)}
                      >
                        <X color="#EF4444" />
                      </Button>
                    </section>

                    {index !== shoppingCart.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="my-2 text-pretty text-center text-sm font-medium">
              The shopping cart is empty.
            </p>
          )}

          {shoppingCart && shoppingCart.length >= 1 && (
            <Button
              href="/purchase"
              className="mt-4 w-full"
              onClick={
                isTouchDevice && isOpen ? () => setIsOpen(false) : undefined
              }
            >
              Go to Shopping Cart
            </Button>
          )}
        </article>
      </HoverCardContent>
    </HoverCard>
  );
}
