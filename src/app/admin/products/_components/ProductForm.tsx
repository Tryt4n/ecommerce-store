"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import ErrorMessage from "@/components/ErrorMessage";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { addProduct, updateProduct } from "../../_actions/products";
import type { Product } from "@prisma/client";

export default function ProductForm({
  product,
}: {
  product?: Partial<Product> & NonNullable<Pick<Product, "id">>;
}) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

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
        <Label htmlFor="image">Image</Label>
        <Input type="file" name="image" id="image" required={product == null} />
        {product != null && product.imagePath && (
          <Image
            src={product.imagePath}
            alt="Current product image"
            width="400"
            height="400"
          />
        )}
        {error?.image && <ErrorMessage error={error.image} />}
      </div>

      <SubmitButton />
    </form>
  );
}
