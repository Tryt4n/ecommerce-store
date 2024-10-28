"use client";

import React, { useEffect, useState, type ComponentProps } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import ShoppingCartList from "./ShoppingCartList";
import { ShoppingBasketIcon } from "lucide-react";

type ShoppingCartProps = {
  buttonProps?: ComponentProps<typeof Button>;
  iconProps?: ComponentProps<typeof ShoppingBasketIcon>;
};

export default function ShoppingCartHoverCard({
  buttonProps,
  iconProps,
}: ShoppingCartProps) {
  const { shoppingCart } = useShoppingCart();
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the device is a touchable device. If it is, set the hover card to open on click
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  // Do not render anything while determining the device type
  if (isTouchDevice === null) {
    return null;
  }

  const hoverCardCollisionPadding = width >= 500 ? 20 : 10; // 20px of space from the edge of the screen on each side of the hover card

  return (
    <>
      {isTouchDevice !== undefined && (
        <HoverCard open={isTouchDevice ? isOpen : undefined} closeDelay={500}>
          <HoverCardTrigger asChild>
            <Button
              type="button"
              href={isTouchDevice ? undefined : "/purchase"}
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
                className={
                  isTouchDevice && isOpen ? "text-green-500" : undefined
                }
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
                <ShoppingCartList
                  containerClassNames="max-h-[268px] overflow-y-auto"
                  thumbnailSize={50}
                />
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
      )}
    </>
  );
}
