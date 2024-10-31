"use client";

import React, { useState, type ComponentProps } from "react";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import ShoppingCartIcon from "@/components/svg/ShoppingCartIcon";
import type { ShoppingCart } from "@/types/shoppingCart";

type AddToCartButtonProps = {
  product: Omit<ShoppingCart[number], "quantity">;
} & ComponentProps<"div">;

export default function AddToCartButton({
  product,
  ...props
}: AddToCartButtonProps) {
  const { getShoppingCartFromLocalStorage, updateShoppingCart } =
    useShoppingCart();
  const [quantity, setQuantity] = useState(1);
  const { toast, dismiss } = useToast();

  function addToCart() {
    const cart = getShoppingCartFromLocalStorage();

    const itemIndex = cart.findIndex((item) => item.id === product.id); // Check if the product is already in the cart
    // If the product is not in the cart, add it to the cart
    if (itemIndex === -1) {
      cart.push({
        id: product.id,
        quantity: quantity,
        name: product.name,
        priceInCents: product.priceInCents,
        thumbnailUrl: product.thumbnailUrl,
      });
    } else {
      // If the product is already in the cart, update the quantity
      cart[itemIndex].quantity += quantity;
    }

    updateShoppingCart(cart); // Update the local storage and the context state
    setQuantity(1); // Reset the quantity input
    toast({
      title: "Added to cart",
      description: `The ${product.name} has been added to the cart in quantity of ${quantity}.`,
      className: "flex flex-col",
      action: (
        <Button
          href="/purchase"
          className="ml-0 mr-0 mt-2 w-full"
          style={{ marginLeft: "0px", marginRight: "0px" }}
          onClick={() => dismiss()}
        >
          Go to Shopping Cart
        </Button>
      ),
      variant: "default",
    }); // Show a toast message
  }

  return (
    <div
      {...props}
      className={`my-4 flex flex-row flex-wrap justify-center gap-x-4 gap-y-2${props.className ? ` ${props.className}` : ""}`}
    >
      <div className="flex justify-center gap-2">
        <Button
          type="button"
          id="decreaseQuantityButton"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-controls="quantityInput"
          disabled={quantity <= 1}
          onClick={() => {
            if (quantity <= 1) setQuantity(1);
            if (quantity > 1) setQuantity(quantity - 1);
          }}
        >
          <span className="sr-only">Decrease quantity by 1</span>
          <Minus />
        </Button>

        <Label>
          <span className="sr-only">
            Enter the quantity of the product you want to add to your cart
          </span>

          <Input
            type="number"
            name="quantityInput"
            id="quantityInput"
            className="w-28 text-center"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value < 1 || value > 99) return;
              setQuantity(parseInt(e.target.value));
            }}
            onBlur={(e) => {
              if (e.target.value === "") setQuantity(1);
            }}
            placeholder="Quantity"
            min={1}
            max={99}
            aria-live="polite"
          />
        </Label>

        <Button
          type="button"
          id="increaseQuantityButton"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-controls="quantityInput"
          disabled={quantity >= 99}
          onClick={() => {
            if (quantity >= 99) setQuantity(99);
            if (quantity < 99) setQuantity(quantity + 1);
          }}
        >
          <span className="sr-only">Increase quantity by 1</span>
          <Plus />
        </Button>
      </div>

      <Button type="button" size="icon" className="w-12" onClick={addToCart}>
        <span className="sr-only">Add to cart</span>
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}
