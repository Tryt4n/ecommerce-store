"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
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

async function authenticator() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/api/upload-auth`
    );

    if (!res.ok) {
      throw new Error("Authentication failed!" + res.text());
    }

    const data = await res.json();
    const { token, expire, signature } = data;

    return { token, expire, signature };
  } catch (error) {
    throw new Error("Authentication failed!");
  }
}

export default function ImageUpload({
  productImages,
}: {
  productImages?: string[];
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>(productImages || []);

  const { toast } = useToast();

  const ikUploadRef = useRef<HTMLInputElement>(null);

  function resetInput() {
    if (!ikUploadRef.current) return;
    ikUploadRef.current.value = "";
    setProgress(null);
  }

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <Label htmlFor="selectImage">Images</Label>
      <IKUpload
        id="selectImage"
        name="selectImage"
        className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ikUploadRef}
        useUniqueFileName
        disabled={progress != null}
        validateFile={(file) => {
          // Check if the file is an image
          if (file.size > 3000000) {
            toast({
              variant: "destructive",
              title: "Image is too large",
              description: "Please upload an image smaller than 3MB.",
            });
            return false;
          } else return true;
        }}
        onError={(error) => {
          console.error(error);
          resetInput();
          toast({
            title: "Error uploading image",
            variant: "destructive",
          });
        }}
        onSuccess={(res) => {
          resetInput();
          setImages([...images, res.url]);
          toast({
            title: "Image uploaded successfully",
            variant: "success",
          });
        }}
        onUploadProgress={(progress) => {
          setProgress((progress.loaded / progress.total) * 100);
        }}
      />

      {progress && progress > 0 && <Progress value={progress} />}

      {images.length > 0 && (
        <>
          <Input type="hidden" id="images" name="images" value={images} />

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
                {images.map((url, index) => {
                  if (images.length > 1) {
                    return (
                      <SortableItem key={`${index}-${url}`} item={url}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative mx-auto flex h-[320px] w-[320px] items-center rounded-md border">
                                <Image
                                  src={url}
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
                                  className="z-100 absolute right-0 top-0 h-[32px] w-[32px] p-1"
                                  onClick={() => {
                                    setImages(
                                      images.filter((_, i) => i !== index)
                                    );
                                  }}
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
                      <Image key={index} src={url} alt={`Uploaded image`} />
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
