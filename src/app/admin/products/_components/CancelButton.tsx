"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useEventListener } from "@/hooks/useEventListener";
import { Button } from "../../../../components/ui/button";
import {
  deleteFolderInImageKit,
  deleteFileInImageKit,
} from "@/lib/imagekit/files";
import type { UploadedFile, UploadedImage } from "@/lib/imagekit/type";

type CancelButtonProps = {
  allUploadedImages: UploadedImage[];
  uploadedFile: UploadedFile;
  folderName: string;
  canDeleteFolder?: boolean;
  alreadyExistingProductImages?: UploadedImage[];
  originalUploadedFile?: UploadedFile;
};

export default function CancelButton({
  allUploadedImages,
  uploadedFile,
  folderName,
  canDeleteFolder,
  alreadyExistingProductImages,
  originalUploadedFile,
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

        const promisesToExecute = imagesToDelete.map((image) =>
          deleteFileInImageKit(image.id)
        );

        if (
          (!originalUploadedFile && uploadedFile) ||
          (originalUploadedFile &&
            uploadedFile &&
            originalUploadedFile.id !== uploadedFile.id)
        ) {
          promisesToExecute.push(deleteFileInImageKit(uploadedFile.id));
        }

        await Promise.all(promisesToExecute);
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
    uploadedFile,
    originalUploadedFile,
  ]);

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

  useEventListener("beforeunload", handleBeforeUnload);
  useEventListener("popstate", handlePopState);
  useEventListener("hashchange", handleHashChange);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isCanceling}
      size="lg"
      onClick={async () => {
        await handleCancel().then(() => router.back());
      }}
    >
      {isCanceling ? "Canceling..." : "Cancel"}
    </Button>
  );
}
