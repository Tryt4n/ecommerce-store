"use client";

import React, { forwardRef, useState, type ForwardedRef } from "react";
import { useToast } from "@/hooks/useToast";
import {
  authenticator,
  uploadFilesToImagekit,
  deleteImageInImageKit,
} from "@/lib/imagekit/files";
import { ImageKitProvider } from "imagekitio-next";
import Image from "../../../../components/Image";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import Sortable from "../../../../components/Sortable";
import SortableItem from "../../../../components/SortableItem";
import { X } from "lucide-react";
import type { UploadedImage } from "@/lib/imagekit/type";

type ImageUploadProps = {
  allUploadedImages: UploadedImage[];
  setAllUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  alreadyExistingProductImages?: UploadedImage[];
  directoryName: string;
};

export const ImageUpload = forwardRef(ImageUploadInner);

function ImageUploadInner(
  {
    allUploadedImages,
    setAllUploadedImages,
    directoryName,
    alreadyExistingProductImages,
  }: ImageUploadProps,
  ikUploadRef: ForwardedRef<HTMLInputElement>
) {
  const [progress, setProgress] = useState<number | null>(null);
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const { toast } = useToast();

  const isDisabled = directoryName.length >= 5 ? false : true;
  const uploadInfoState =
    !alreadyExistingProductImages &&
    (isDisabled || allUploadedImages.length <= 1);

  function resetInput() {
    if (
      ikUploadRef &&
      typeof ikUploadRef !== "function" &&
      ikUploadRef.current
    ) {
      ikUploadRef.current.value = "";
    }
    setProgress(null);
  }

  async function handleImagesUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;
    if (!files || files.length < 1) return;

    let areFilesTheCorrectSize = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 3000000) {
        toast({
          title: `File ${file.name} is too large`,
          description: "Please upload files that are less than 3MB",
          variant: "destructive",
        });
        areFilesTheCorrectSize = false;
        break;
      }
    }

    if (!areFilesTheCorrectSize) return;

    try {
      setProgress(0);
      const uploadedImages = await uploadFilesToImagekit(
        files,
        directoryName,
        setProgress
      );

      setAllUploadedImages((prevImages) => [...prevImages, ...uploadedImages]);
      toast({
        title: "Images uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error uploading images",
        variant: "destructive",
      });
    } finally {
      resetInput();
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      setIsImageDeleting(true);

      // Delete image in imagekit if product is not saved
      !alreadyExistingProductImages && (await deleteImageInImageKit(imageId));
      // else update state which will be used to delete image in imagekit after form submission
      setAllUploadedImages(
        allUploadedImages.filter((image) => image.id !== imageId)
      );

      toast({
        title: "Image deleted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting image",
        variant: "destructive",
      });
    } finally {
      setIsImageDeleting(false);
    }
  }

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <Label htmlFor="selectImage">Images</Label>
      {uploadInfoState && (
        <div
          id="disabledInfo"
          className="space-y-2 text-pretty pt-2 text-sm font-semibold italic text-muted-foreground"
        >
          {isDisabled && (
            <p>Before adding images, please provide a product name.</p>
          )}
          {allUploadedImages.length < 1 && (
            <p>
              Once you&apos;ve uploaded your images, you{" "}
              <span className="font-bold text-black text-inherit">
                won&apos;t be able
              </span>{" "}
              to change the name of your product.
            </p>
          )}
        </div>
      )}
      <Input
        type="file"
        id="selectImage"
        name="selectImage"
        ref={ikUploadRef}
        multiple
        disabled={isDisabled}
        aria-describedby={isDisabled ? "disabledInfo" : undefined}
        onChange={handleImagesUpload}
      />

      {progress !== null && <Progress value={progress} />}

      {allUploadedImages.length > 0 && (
        <>
          <Input
            type="hidden"
            id="images"
            name="images"
            value={JSON.stringify(allUploadedImages)}
          />

          <div>
            <p className="pt-4 text-sm font-medium">
              Uploaded Images
              {allUploadedImages.length > 1 && (
                <span className="text-muted-foreground">
                  &nbsp;(Sort images by dragging and dropping)
                </span>
              )}
            </p>

            <Sortable items={allUploadedImages} setItems={setAllUploadedImages}>
              {allUploadedImages.map((image, index) => {
                if (allUploadedImages.length > 1) {
                  return (
                    <SortableItem key={`${index}-${image.id}`} item={image}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative mx-auto flex h-[320px] w-[320px] items-center rounded-md border">
                              <Image
                                src={image.url}
                                alt={`Uploaded image-${index === 0 ? "main" : index}`}
                              />

                              {allUploadedImages.length > 1 && index === 0 && (
                                <p
                                  id="main-image"
                                  className="absolute left-0 top-0 z-10 indent-1 font-bold"
                                >
                                  Main Image
                                </p>
                              )}

                              <Button
                                type="button"
                                variant="destructive"
                                disabled={isImageDeleting}
                                className="z-100 absolute right-0 top-0 h-[32px] w-[32px] p-1"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <X />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {index === 0 ? "Main Image" : `Image ${index + 1}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SortableItem>
                  );
                } else {
                  return (
                    <Image key={index} src={image.url} alt={`Uploaded image`} />
                  );
                }
              })}
            </Sortable>
          </div>
        </>
      )}
    </ImageKitProvider>
  );
}
