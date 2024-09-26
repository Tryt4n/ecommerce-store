"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import {
  deleteFolderInImageKit,
  deleteImageInImageKit,
} from "@/lib/imagekit/files";
import type { UploadedImage } from "@/lib/imagekit/type";

type CancelButtonProps = {
  allUploadedImages: UploadedImage[];
  folderName: string;
  alreadyExistingProductImages?: UploadedImage[];
  canDeleteFolder?: boolean;
};

export default function CancelButton({
  allUploadedImages,
  alreadyExistingProductImages,
  folderName,
  canDeleteFolder,
}: CancelButtonProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const handleCancel = useCallback(async () => {
    try {
      setIsCanceling(true);

      if (canDeleteFolder) {
        await deleteFolderInImageKit(folderName);
      } else {
        const imagesToDelete = allUploadedImages.filter(
          (image) =>
            !alreadyExistingProductImages?.some(
              (existingImage) => existingImage.id === image.id
            )
        );

        await Promise.all(
          imagesToDelete.map((image) => deleteImageInImageKit(image.id))
        );
      }
    } catch (error) {
      console.error(`Can't cancel. Error: ${error}`);
    } finally {
      setIsCanceling(false);
    }
  }, [
    canDeleteFolder,
    folderName,
    allUploadedImages,
    alreadyExistingProductImages,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleCancel();
      event.preventDefault();
      event.returnValue = ""; // Chrome requires returnValue to be set
    };

    const handlePopState = () => {
      handleCancel();
    };

    const handleHashChange = () => {
      handleCancel();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [handleCancel]);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isCanceling}
      onClick={async () => {
        await handleCancel().then(() => router.back());
      }}
    >
      {isCanceling ? "Canceling..." : "Cancel"}
    </Button>
  );
}
