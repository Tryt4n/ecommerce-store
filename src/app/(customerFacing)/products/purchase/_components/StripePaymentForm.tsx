import React, {
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, formatDiscountCode } from "@/lib/formatters";
import { createPaymentIntent } from "@/app/_actions/order";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ErrorMessage";
import type { Product } from "@prisma/client";
import type CheckoutForm from "./CheckoutForm";

type StripePaymentFormProps = {
  productId: Product["id"];
  priceInCents: Product["priceInCents"];
  discountCode: ComponentProps<typeof CheckoutForm>["discountCode"];
};

export default function StripePaymentForm({
  productId,
  priceInCents,
  discountCode,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>("");

  const discountCodeRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const coupon = searchParams.get("coupon");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const formSubmit = await elements.submit();
    if (formSubmit.error != null) {
      setErrorMessage(
        formSubmit.error.message ||
          "An unknown error occurred. Please try again."
      );
      setIsLoading(false);
      return;
    }

    const paymentIntent = await createPaymentIntent(
      email,
      productId,
      discountCode?.code
    );
    if (!paymentIntent.clientSecret) {
      setErrorMessage(
        paymentIntent?.error || "An unknown error occurred. Please try again."
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
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

          <div className="mt-4 space-y-2">
            <Label
              htmlFor="discountCode"
              className="font-normal text-[#30313d]"
            >
              Coupon
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                id="discountCode"
                name="discountCode"
                className="w-full max-w-xs"
                ref={discountCodeRef}
                defaultValue={coupon || ""}
              />

              <Button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set(
                    "coupon",
                    discountCodeRef.current?.value.trim() || ""
                  );
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                Apply
              </Button>
            </div>
            {coupon != null && discountCode == null && (
              <ErrorMessage error={"Invalid discount code."} />
            )}
            {discountCode && (
              <p className="text-sm text-green-500">
                {`${formatDiscountCode(
                  discountCode.discountAmount,
                  discountCode.discountType
                )} discount applied`}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 sm:flex-nowrap">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null}
          >
            {`${isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(priceInCents / 100)}`} `}
          </Button>

          <Button
            type="button"
            size="lg"
            variant="destructive"
            className="ml-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
