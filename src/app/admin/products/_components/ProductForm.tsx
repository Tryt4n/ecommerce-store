"use client";

import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/formatters";
import { addProduct, updateProduct } from "../_actions/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import CancelButton from "./CancelButton";
import ErrorMessage from "@/components/ErrorMessage";
import MultipleSelector from "@/components/ui/multiple-selector";
import { ImageUpload } from "./ImageUpload";
import { FileUpload } from "./FileUpload";
import CurrentFilePreview from "./CurrentFilePreview";
import UploadInfo from "./UploadInfo";
import type { getCategories } from "@/db/userData/categories";
import type { getProduct } from "@/db/userData/products";
import type { UploadedFile, UploadedImage } from "@/lib/imagekit/type";

type ProductFormProps = {
  product?: Awaited<ReturnType<typeof getProduct>>;
  categories?: Awaited<ReturnType<typeof getCategories>>;
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [name, setName] = useState(product?.name || "");
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const [selectedCategories, setSelectedCategories] = useState<
    ProductFormProps["categories"]
  >(product?.categories || []);
  const [images, setImages] = useState<UploadedImage[]>(product?.images || []);
  const [file, setFile] = useState<UploadedFile>(product?.productFile || null);

  const { toast } = useToast();

  const ikUploadRef = useRef<HTMLInputElement>(null);

  const MIN_NAME_LENGTH = 5;
  const nameInputDisabledStatus =
    (name.length >= MIN_NAME_LENGTH && images.length > 0) || file
      ? true
      : false;

  const isFilesUploadDisabled = name.length >= MIN_NAME_LENGTH ? false : true;
  const uploadInfoState =
    !product?.images && !file && (isFilesUploadDisabled || images.length <= 1);

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          required
          minLength={MIN_NAME_LENGTH}
          value={name}
          disabled={nameInputDisabledStatus}
          onChange={(e) => setName(e.target.value)}
        />
        {
          // Display hidden input if nameInputDisabledStatus is true because `disabled` input won't be submitted
          nameInputDisabledStatus && (
            <Input type="hidden" name="name" value={name} />
          )
        }
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
        <p className="text-muted-foreground" aria-label="Entered price">
          {formatCurrency((priceInCents || 0) / 100)}
        </p>
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

      {uploadInfoState && (
        <UploadInfo
          isFilesUploadDisabled={isFilesUploadDisabled}
          isAnyFileUploaded={images.length < 1 || file ? true : false}
        />
      )}

      <div className="space-y-2">
        <FileUpload
          uploadedFile={file}
          setFile={setFile}
          directoryName={name}
          originalUploadedFile={product?.productFile}
          isDisabled={isFilesUploadDisabled}
        />

        {file && <CurrentFilePreview file={file} setFile={setFile} />}

        {error?.productFile && <ErrorMessage error={error.productFile} />}
      </div>

      <div className="space-y-2">
        <ImageUpload
          ref={ikUploadRef}
          allUploadedImages={images}
          setAllUploadedImages={setImages}
          alreadyExistingProductImages={product?.images}
          directoryName={name}
          isDisabled={isFilesUploadDisabled}
        />
        {error?.images && <ErrorMessage error={error.images} />}
      </div>

      <div className="flex flex-row gap-4">
        <SubmitButton edit={product ? true : false} />

        <CancelButton
          allUploadedImages={images}
          uploadedFile={file}
          folderName={name}
          canDeleteFolder={!product && (images.length > 0 || file != null)}
          alreadyExistingProductImages={product?.images}
          originalUploadedFile={product?.productFile}
        />
      </div>
    </form>
  );
}
