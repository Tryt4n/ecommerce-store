"use client";

import React, { forwardRef, useState, type ForwardedRef } from "react";
import { useToast } from "@/hooks/useToast";
import {
  uploadFilesToImagekit,
  deleteFileInImageKit,
} from "@/lib/imagekit/files";
import Image from "../../../../components/Image";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import { Input } from "../../../../components/ui/input";
import Sortable from "../../../../components/Sortable";
import SortableItem from "../../../../components/SortableItem";
import SortImagesInfo from "./SortImagesInfo";
import CustomTooltip from "@/components/Tooltip";
import XButton from "@/components/ui/XButton";
import type { UploadedImage } from "@/lib/imagekit/type";

type ImageUploadProps = {
  allUploadedImages: UploadedImage[];
  setAllUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  alreadyExistingProductImages?: UploadedImage[];
  directoryName: string;
  isDisabled?: boolean;
};

export const ImageUpload = forwardRef(ImageUploadInner);

function ImageUploadInner(
  {
    allUploadedImages,
    setAllUploadedImages,
    directoryName,
    alreadyExistingProductImages,
    isDisabled = false,
  }: ImageUploadProps,
  ikUploadRef: ForwardedRef<HTMLInputElement>
) {
  const [progress, setProgress] = useState<number | null>(null);
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const { toast } = useToast();

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
    let totalFilesSize = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      totalFilesSize += file.size;

      // 3MB
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

    // 20MB
    if (totalFilesSize > 20000000) {
      toast({
        title: `Total files size is too large (${(totalFilesSize / 1000000).toFixed(2)}MB)`,
        description: "Please upload files that are less than 20MB",
        variant: "destructive",
      });
      resetInput();
      return;
    }

    if (files.length > 10) {
      toast({
        title: "Too many files",
        description: "Please upload 15 files or less",
        variant: "destructive",
      });
      resetInput();
      return;
    }

    if (!areFilesTheCorrectSize) {
      resetInput();
      return;
    }

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
      !alreadyExistingProductImages && (await deleteFileInImageKit(imageId));
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
    <>
      <Label htmlFor="selectImage">Images</Label>
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
            <SortImagesInfo length={allUploadedImages.length} />

            <Sortable items={allUploadedImages} setItems={setAllUploadedImages}>
              {allUploadedImages.map((image, index) => {
                if (allUploadedImages.length > 1) {
                  return (
                    <SortableItem key={`${index}-${image.id}`} item={image}>
                      <CustomTooltip
                        content={
                          index === 0 ? "Main Image" : `Image ${index + 1}`
                        }
                        trigger={
                          <div className="relative flex h-full w-full justify-center overflow-hidden rounded-md border">
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

                            <XButton
                              disabled={isImageDeleting}
                              onClick={() => handleDeleteImage(image.id)}
                            />
                          </div>
                        }
                      />
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
    </>
  );
}
