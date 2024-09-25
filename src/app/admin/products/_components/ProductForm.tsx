"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/formatters";
import { addProduct, updateProduct } from "../_actions/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import ErrorMessage from "@/components/ErrorMessage";
import MultipleSelector from "@/components/ui/multiple-selector";
import ImageUpload from "@/components/ImageUpload";
import type { getCategories } from "@/db/userData/categories";
import type { getProduct } from "@/db/userData/products";

type ProductFormProps = {
  product?: Awaited<ReturnType<typeof getProduct>>;
  categories?: Awaited<ReturnType<typeof getCategories>>;
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [selectedCategories, setSelectedCategories] = useState<
    ProductFormProps["categories"]
  >(product?.categories || []);
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const { toast } = useToast();

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          defaultValue={product?.name}
          required
          minLength={1}
        />
        {error?.name && <ErrorMessage error={error.name} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          name="priceInCents"
          id="priceInCents"
          min={1}
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value))}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error?.priceInCents && <ErrorMessage error={error.priceInCents} />}
      </div>

      <div className="space-y-2">
        <MultipleSelector
          defaultOptions={
            categories?.map((category) => ({
              label: category,
              value: category,
            })) || []
          }
          placeholder="Select product's categories"
          commandProps={{ className: "capitalize" }}
          hidePlaceholderWhenSelected
          maxSelected={3}
          onMaxSelected={() =>
            toast({
              variant: "default",
              title: "You can only select up to 3 categories.",
            })
          }
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
        {error?.categories && <ErrorMessage error={error.categories} />}
        <Input
          type="hidden"
          id="categories"
          name="categories"
          value={selectedCategories}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          defaultValue={product?.description}
          required
          minLength={10}
        />
        {error?.description && <ErrorMessage error={error.description} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" name="file" id="file" required={product == null} />
        {product != null && product.filePath && (
          <p className="text-muted-foreground">{product.filePath}</p>
        )}
        {error?.file && <ErrorMessage error={error.file} />}
      </div>

      <div className="space-y-2">
        <ImageUpload productImages={product?.images} />
        {error?.images && <ErrorMessage error={error.images} />}
      </div>

      <SubmitButton edit={product ? true : false} />
    </form>
  );
}
