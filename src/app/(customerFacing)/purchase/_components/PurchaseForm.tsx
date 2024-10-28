"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { useToast } from "@/hooks/useToast";
import { handlePurchaseProduct } from "../_actions/purchaseProducts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SubmitButton from "@/components/SubmitButton";
import ErrorMessage from "@/components/ErrorMessage";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export default function PurchaseForm({
  user,
  products,
}: {
  user: KindeUser<Record<string, string>>;
  products: {
    productId: string;
    quantity: number;
    priceInCents: number;
  }[];
}) {
  const [purchaseData, action] = useFormState(
    handlePurchaseProduct.bind(null, products),
    undefined
  );
  const { clearShoppingCart } = useShoppingCart();
  const router = useRouter();
  const { toast } = useToast();

  const [createInvoice, setCreateInvoice] = useState(false);

  useEffect(() => {
    if (!purchaseData) return;

    if (purchaseData.data?.url) {
      router.push(purchaseData.data.url);
      clearShoppingCart();
    }
  }, [purchaseData, clearShoppingCart, router]);

  if (purchaseData?.customError) {
    toast({
      title: "Error",
      description: purchaseData.customError,
      variant: "destructive",
    });
  }

  return (
    <form action={action}>
      <input type="hidden" name="email" id="email" value={user.email || ""} />
      <input
        type="hidden"
        name="lastName"
        id="lastName"
        value={user.family_name || ""}
      />
      <input
        type="hidden"
        name="firstName"
        id="firstName"
        value={user.given_name || ""}
      />

      <div className="my-2 flex items-center">
        <label className="flex cursor-pointer items-center space-x-2">
          <span className="class-name text-sm font-semibold">
            Do you want an invoice?
          </span>
          <Checkbox
            name="invoice"
            id="invoice"
            title="Check if you want to receive an invoice."
            checked={createInvoice}
            onCheckedChange={() => setCreateInvoice(!createInvoice)}
            aria-controls="invoiceForm"
          />
        </label>
        {purchaseData?.errors?.createInvoice && (
          <ErrorMessage error={purchaseData.errors.createInvoice} />
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: createInvoice ? "1fr" : "0fr",
        }}
        className="transition-all duration-300"
      >
        <fieldset
          id="invoiceForm"
          className={`space-y-2 overflow-hidden rounded-lg ${createInvoice ? "mb-4 mt-2 border border-primary px-4 pb-6" : ""}`}
          aria-hidden={!createInvoice}
        >
          <legend
            className={createInvoice ? "px-1 text-sm font-medium" : "hidden"}
          >
            Complete your invoice details
          </legend>

          <div>
            <Label htmlFor="companyName">Name</Label>
            <Input
              name="companyName"
              id="companyName"
              type="text"
              placeholder="Company Name"
              minLength={5}
              maxLength={100}
              required={createInvoice}
              disabled={!createInvoice}
            />
            {purchaseData?.errors?.companyName && (
              <ErrorMessage error={purchaseData.errors.companyName} />
            )}
          </div>

          <div className="flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-end sm:[&>*]:w-1/2">
            <div>
              <Label htmlFor="companyStreet">Street</Label>
              <Input
                name="companyStreet"
                id="companyStreet"
                type="text"
                placeholder="Street"
                minLength={3}
                maxLength={80}
                required={createInvoice}
                disabled={!createInvoice}
              />
              {purchaseData?.errors?.companyStreet && (
                <ErrorMessage error={purchaseData.errors.companyStreet} />
              )}
            </div>

            <div className="flex items-end gap-4 [&>*]:flex-grow">
              <div>
                <Label htmlFor="companyStreetNumber">Street Number</Label>
                <Input
                  name="companyStreetNumber"
                  id="companyStreetNumber"
                  type="text"
                  placeholder="20"
                  minLength={1}
                  maxLength={10}
                  required={createInvoice}
                  disabled={!createInvoice}
                />
                {purchaseData?.errors?.companyStreetNumber && (
                  <ErrorMessage
                    error={purchaseData.errors.companyStreetNumber}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="companyApartmentNumber">Apartment Number</Label>
                <Input
                  name="companyApartmentNumber"
                  id="companyApartmentNumber"
                  type="text"
                  placeholder="123 (optional)"
                  minLength={1}
                  maxLength={10}
                  disabled={!createInvoice}
                />
                {purchaseData?.errors?.companyApartmentNumber && (
                  <ErrorMessage
                    error={purchaseData.errors.companyApartmentNumber}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-end sm:[&>*]:w-1/2">
            <div className="flex gap-x-4 gap-y-2 sm:items-end [&>*]:flex-grow sm:[&>*]:w-1/2">
              <div>
                <Label htmlFor="companyCity">City</Label>
                <Input
                  name="companyCity"
                  id="companyCity"
                  type="text"
                  placeholder="City"
                  minLength={3}
                  maxLength={50}
                  required={createInvoice}
                  disabled={!createInvoice}
                />
                {purchaseData?.errors?.companyCity && (
                  <ErrorMessage error={purchaseData.errors.companyCity} />
                )}
              </div>

              <div>
                <Label htmlFor="companyZipCode">Zip Code</Label>
                <Input
                  name="companyZipCode"
                  id="companyZipCode"
                  type="text"
                  placeholder="12-345"
                  minLength={3}
                  maxLength={6}
                  required={createInvoice}
                  disabled={!createInvoice}
                />
                {purchaseData?.errors?.companyZipCode && (
                  <ErrorMessage error={purchaseData.errors.companyZipCode} />
                )}
              </div>
            </div>

            <div className="">
              <Label htmlFor="NIP">NIP</Label>
              <Input
                name="NIP"
                id="NIP"
                type="text"
                placeholder="1234567890"
                minLength={10}
                maxLength={10}
                required={createInvoice}
                disabled={!createInvoice}
              />
              {purchaseData?.errors?.NIP && (
                <ErrorMessage error={purchaseData.errors.NIP} />
              )}
            </div>
          </div>
        </fieldset>
      </div>

      <div></div>

      {purchaseData?.errors?.email && (
        <ErrorMessage error={purchaseData.errors.email} />
      )}
      {purchaseData?.errors?.firstName && (
        <ErrorMessage error={purchaseData.errors.firstName} />
      )}
      {purchaseData?.errors?.lastName && (
        <ErrorMessage error={purchaseData.errors.lastName} />
      )}
      {purchaseData?.errors?.products && (
        <ErrorMessage error={purchaseData.errors.products} />
      )}

      <SubmitButton
        initialText="Purchase"
        pendingText="Purchasing..."
        size="lg"
        className="mt-2 text-base"
      />
    </form>
  );
}
