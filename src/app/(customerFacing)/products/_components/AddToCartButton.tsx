"use client";

import React, { useState, type ComponentProps } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@prisma/client";

type ShoppingCartItem = {
  id: string;
  quantity: number;
};

type ShoppingCart = ShoppingCartItem[];

type AddToCartButtonProps = {
  id: Product["id"];
  productName: Product["name"];
} & ComponentProps<"div">;

export default function AddToCartButton({
  id,
  productName,
  ...props
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  function addToCart() {
    const cart: ShoppingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      cart.push({ id: id, quantity: quantity });
    } else {
      cart[itemIndex].quantity += quantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(1);
    toast({
      title: "Added to cart",
      description: `The ${productName} has been added to the cart in quantity of ${quantity}.`,
      variant: "default",
    });
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

        <div>
          <Label htmlFor="quantityInput" className="sr-only">
            Enter the quantity of the product you want to add to your cart
          </Label>
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
        </div>

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
        {/* Cart Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          data-src="https://cdn.hugeicons.com/icons/shopping-cart-add-01-solid-standard.svg"
          color="#FFF"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.12499 2.99902C2.12499 2.44674 2.57271 1.99902 3.12499 1.99902H5.62499C6.11581 1.99902 6.53408 2.35523 6.61223 2.83979L8.84102 16.6583C8.91917 17.1428 9.33744 17.499 9.82826 17.499H18.125C18.6773 17.499 19.125 17.9467 19.125 18.499C19.125 19.0513 18.125 18.8286 17.8205 19.0816L17.104 19.499H11.0943L9.49248 18.8443C8.86964 18.8443 8.62154 19.3078 8.13734 18.9772C7.47683 18.5261 7.00182 17.8155 6.86654 16.9767L4.77336 3.99902H3.12499C2.57271 3.99902 2.12499 3.55131 2.12499 2.99902Z"
            fill="#FFF"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.37499 19.001C8.82271 19.001 8.37499 19.4487 8.37499 20.001C8.37499 20.5533 8.82271 21.001 9.37499 21.001C9.92728 21.001 10.375 20.5533 10.375 20.001C10.375 19.4487 9.92728 19.001 9.37499 19.001ZM6.87499 20.001C6.87499 18.6203 7.99428 17.501 9.37499 17.501C10.7557 17.501 11.875 18.6203 11.875 20.001C11.875 21.3817 10.7557 22.501 9.37499 22.501C7.99428 22.501 6.87499 21.3817 6.87499 20.001Z"
            fill="#FFF"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.375 19.001C17.8227 19.001 17.375 19.4487 17.375 20.001C17.375 20.5533 17.8227 21.001 18.375 21.001C18.9273 21.001 19.375 20.5533 19.375 20.001C19.375 19.4487 18.9273 19.001 18.375 19.001ZM15.875 20.001C15.875 18.6203 16.9943 17.501 18.375 17.501C19.7557 17.501 20.875 18.6203 20.875 20.001C20.875 21.3817 19.7557 22.501 18.375 22.501C16.9943 22.501 15.875 21.3817 15.875 20.001Z"
            fill="#FFF"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.125 1.49902C13.6773 1.49902 14.125 1.94674 14.125 2.49902V4.99902H16.625C17.1773 4.99902 17.625 5.44674 17.625 5.99902C17.625 6.55131 17.1773 6.99902 16.625 6.99902H14.125V9.49902C14.125 10.0513 13.6773 10.499 13.125 10.499C12.5727 10.499 12.125 10.0513 12.125 9.49902V6.99902H9.62499C9.07271 6.99902 8.62499 6.55131 8.62499 5.99902C8.62499 5.44674 9.07271 4.99902 9.62499 4.99902H12.125V2.49902C12.125 1.94674 12.5727 1.49902 13.125 1.49902Z"
            fill="#FFF"
          ></path>
          <path
            d="M7.45005 5.24902H6.125C5.9003 5.24902 5.68745 5.34977 5.54499 5.52353C5.40254 5.6973 5.3455 5.92578 5.38956 6.14611L7.38956 16.1461C7.46935 16.5451 7.85267 16.8076 8.2535 16.7379L19.7535 14.7379C20.0618 14.6843 20.3045 14.4449 20.3622 14.1372L21.8622 6.13724C21.9033 5.91795 21.8446 5.69173 21.7021 5.52005C21.5596 5.34836 21.3481 5.24902 21.125 5.24902H18.7999C18.881 5.4841 18.925 5.73642 18.925 5.99902C18.925 7.26928 17.8952 8.29902 16.625 8.29902H15.425V9.49902C15.425 10.7693 14.3952 11.799 13.125 11.799C11.8547 11.799 10.825 10.7693 10.825 9.49902V8.29902H9.62499C8.35474 8.29902 7.32499 7.26928 7.32499 5.99902C7.32499 5.73642 7.369 5.4841 7.45005 5.24902Z"
            fill="#FFF"
          ></path>
        </svg>
      </Button>
    </div>
  );
}
