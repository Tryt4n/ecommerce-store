"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  authenticator,
  deleteImage,
  uploadFiles,
} from "@/lib/imagekit/uploadFiles";
import { ImageKitProvider } from "imagekitio-next";
import Image from "./Image";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Sortable from "./Sortable";
import SortableItem from "./SortableItem";
import { X } from "lucide-react";
import type { UploadedImage } from "@/lib/imagekit/type";

export default function ImageUpload({
  productImages,
}: {
  productImages?: UploadedImage[];
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [images, setImages] = useState<UploadedImage[]>(productImages || []);
  const [isImageDeleting, setIsImageDeleting] = useState(false);

  const { toast } = useToast();

  const ikUploadRef = useRef<HTMLInputElement>(null);

  function resetInput() {
    if (!ikUploadRef.current) return;
    ikUploadRef.current.value = "";
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
      const uploadedImages = await uploadFiles(files, setProgress);

      setImages((prevImages) => [...prevImages, ...uploadedImages]);
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

      await deleteImage(imageId);

      setImages(images.filter((image) => image.id !== imageId));

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
      <Input
        type="file"
        id="selectImage"
        name="selectImage"
        ref={ikUploadRef}
        multiple
        onChange={handleImagesUpload}
      />

      {progress !== null && <Progress value={progress} />}

      {images.length > 0 && (
        <>
          <Input
            type="hidden"
            id="images"
            name="images"
            value={JSON.stringify(images)}
          />

          <div>
            <p className="pt-4 text-sm font-medium">
              Uploaded Images
              {images.length > 1 && (
                <span className="text-muted-foreground">
                  &nbsp;(Sort images by dragging and dropping)
                </span>
              )}
            </p>

            <Sortable items={images} setItems={setImages}>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((image, index) => {
                  if (images.length > 1) {
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

                                {images.length > 1 && index === 0 && (
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
                              {index === 0
                                ? "Main Image"
                                : `Image ${index + 1}`}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SortableItem>
                    );
                  } else {
                    return (
                      <Image
                        key={index}
                        src={image.url}
                        alt={`Uploaded image`}
                      />
                    );
                  }
                })}
              </ul>
            </Sortable>
          </div>
        </>
      )}
    </ImageKitProvider>
  );
}
