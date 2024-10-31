"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/useToast";
import { DiscountCodeType } from "@prisma/client";
import { addDiscountCode } from "../_actions/discounts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import CancelButton from "@/components/CancelButton";
import MultipleSelector from "@/components/ui/multiple-selector";
import ErrorMessage from "@/components/ErrorMessage";
import SubmitButton from "@/components/SubmitButton";
import type { getAllProducts } from "@/db/adminData/products";
import type { getCategories } from "@/db/userData/categories";

type DiscountCodeFormProps = {
  products: Awaited<ReturnType<typeof getAllProducts>>;
  categories?: Awaited<ReturnType<typeof getCategories>>;
};

export default function DiscountCodeForm({
  products,
  categories,
}: DiscountCodeFormProps) {
  const [error, action] = useFormState(addDiscountCode, {});

  const [allProducts, setAllProducts] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; name: string }[] | undefined
  >();

  const [selectedCategories, setSelectedCategories] =
    useState<DiscountCodeFormProps["categories"]>();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { toast } = useToast();

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  useEffect(() => {
    if (!isFormSubmitted) return;

    if (error && Object.values(error).some((field) => field !== undefined)) {
      toast({
        title: "Error",
        description:
          "There was an error while trying to add the discount code.",
        variant: "destructive",
      });

      setIsFormSubmitted(false);
      return;
    }

    toast({
      title: "Added",
      description: "Discount code added successfully.",
      variant: "success",
    });
  }, [isFormSubmitted, error, toast]);

  return (
    <form
      action={action}
      onSubmit={() => setIsFormSubmitted(true)}
      className="space-y-8 px-1"
    >
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input type="text" name="code" id="code" required minLength={5} />
        {error?.code && <ErrorMessage error={error.code} />}
      </div>

      <div className="flex items-baseline gap-8 space-y-2">
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <RadioGroup
            id="discountType"
            name="discountType"
            defaultValue={DiscountCodeType.PERCENTAGE}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.PERCENTAGE}
              />
              <Label htmlFor="percentage">Percentage</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="fixed" value={DiscountCodeType.FIXED} />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
          {error?.discountType && <ErrorMessage error={error.discountType} />}
        </div>

        <div className="flex-grow space-y-2">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            type="number"
            name="discountAmount"
            id="discountAmount"
            required
            min={1}
          />
          {error?.discountAmount && (
            <ErrorMessage error={error.discountAmount} />
          )}
        </div>
      </div>

      <fieldset>
        <legend className="sr-only">Optional options</legend>

        <div className="my-6 space-y-2">
          <Label htmlFor="limit">Limit</Label>
          <Input
            type="number"
            name="limit"
            id="limit"
            aria-describedby="limit-description"
          />
          <p id="limit-description" className="text-sm text-muted-foreground">
            Leave blank for infinite uses
          </p>
          {error?.limit && <ErrorMessage error={error.limit} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration</Label>
          <Input
            type="datetime-local"
            name="expiresAt"
            id="expiresAt"
            min={today.toJSON().split(":").slice(0, -1).join(":")} // Remove seconds
            className="w-max"
            aria-describedby="expiresAt-description"
          />
          <p
            id="expiresAt-description"
            className="text-sm text-muted-foreground"
          >
            Leave blank for no expiration
          </p>
          {error?.expiresAt && <ErrorMessage error={error.expiresAt} />}
        </div>
      </fieldset>

      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
        <fieldset className="flex-grow space-y-2">
          <legend>Allowed Products</legend>

          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="allProducts"
                name="allProducts"
                checked={allProducts}
                disabled={selectedCategories && selectedCategories.length > 0}
                onCheckedChange={(e) => setAllProducts(e === true)}
              />
              <Label htmlFor="allProducts">All Products</Label>
            </div>

            {products && (
              <div className="flex-grow">
                <MultipleSelector
                  disabled={
                    allProducts ||
                    (selectedCategories && selectedCategories.length > 0)
                  }
                  defaultOptions={products.map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  placeholder={
                    allProducts
                      ? `Disabled when "All Products" is enabled.`
                      : "Select the products for which the coupon will be valid."
                  }
                  commandProps={{ className: "capitalize" }}
                  hidePlaceholderWhenSelected
                  value={selectedProducts?.map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  onChange={(selected) =>
                    setSelectedProducts(
                      selected.map((product) => ({
                        id: product.value,
                        name: product.label,
                      }))
                    )
                  }
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
                <Input
                  type="hidden"
                  name="productIds"
                  id="productIds"
                  value={selectedProducts?.map((product) => product.id)}
                />
              </div>
            )}
          </div>

          {error?.allProducts && <ErrorMessage error={error.allProducts} />}
          {error?.productIds && <ErrorMessage error={error.productIds} />}
        </fieldset>

        <fieldset className="flex-grow space-y-2">
          <legend>Allowed Categories</legend>

          <MultipleSelector
            defaultOptions={categories?.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="Select the categories for which the coupon will be valid."
            commandProps={{ className: "capitalize" }}
            hidePlaceholderWhenSelected
            creatable
            value={selectedCategories?.map((category) => ({
              label: category,
              value: category,
            }))}
            onChange={(selected) =>
              setSelectedCategories(selected.map((category) => category.value))
            }
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
          />
          <Input
            type="hidden"
            id="categories"
            name="categories"
            value={selectedCategories}
          />

          {error?.categories && <ErrorMessage error={error.categories} />}
        </fieldset>
      </div>

      <div className="flex flex-row gap-4">
        <SubmitButton className="text-base" size="lg" />

        <CancelButton />
      </div>
    </form>
  );
}
