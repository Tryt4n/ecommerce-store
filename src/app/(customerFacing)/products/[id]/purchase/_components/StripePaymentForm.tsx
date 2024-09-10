import React, { useState, type FormEvent } from "react";
import { formatCurrency } from "@/lib/formatters";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@prisma/client";
import { userOrderExist } from "@/app/_actions/order";

export default function StripePaymentForm({
  productId,
  priceInCents,
}: {
  productId: Product["id"];
  priceInCents: Product["priceInCents"];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const orderExist = await userOrderExist(email, productId);

    if (orderExist) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page."
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (
          (error.type === "card_error" || error.type === "validation_error") &&
          error.message
        ) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred. Please try again.");
          console.error(error);
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement
            className="w-full"
            options={{ defaultValues: { billingDetails: { email: email! } } }}
            onChange={(e) => setPaymentMethod(e.value.type)}
          />
          {paymentMethod !== "blik" && paymentMethod !== "p24" && (
            <LinkAuthenticationElement
              className="mt-4"
              onChange={(e) => setEmail(e.value.email)}
            />
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null}
          >
            {`${isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(priceInCents / 100)}`} `}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
