import React, { useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  deleteImageInImageKit,
  uploadFilesToImagekit,
} from "@/lib/imagekit/files";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { UploadedFile } from "@/lib/imagekit/type";

type FileUploadInnerProps = {
  directoryName: string;
  uploadedFile: UploadedFile | null;
  setFile: React.Dispatch<React.SetStateAction<UploadedFile>>;
  originalUploadedFile?: UploadedFile;
};

export function FileUpload({
  directoryName,
  uploadedFile,
  setFile,
  originalUploadedFile,
}: FileUploadInnerProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>(uploadedFile?.name || "");
  const { toast } = useToast();

  const isDisabled = directoryName.length >= 5 ? false : true;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length !== 1) return;

    // 5MB
    if (files[0].size > 5000000) {
      toast({
        title: "File size is too big",
        description: "The file size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setProgress(0);

      const newUploadedFile = await uploadFilesToImagekit(
        files,
        directoryName,
        setProgress
      );

      // Handle the case when the user uploads a new file and then re-uploads the new file
      // It make sure that the previous uploaded file is deleted
      if (
        originalUploadedFile &&
        uploadedFile &&
        newUploadedFile &&
        uploadedFile.url !== newUploadedFile[0].url &&
        originalUploadedFile.url !== uploadedFile.url
      ) {
        await deleteImageInImageKit(uploadedFile.id);
      }

      if (fileName === "") {
        setFileName(files[0].name);
      }

      setFile({ ...newUploadedFile[0], name: fileName || files[0].name });
      toast({
        title: "File uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error(`Can't upload file. Error: ${error}`);
      toast({
        title: "Error uploading file",
        variant: "destructive",
      });
    } finally {
      setProgress(null);
    }
  }

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="max-w-[50%] space-y-2">
          <Label htmlFor="file">File</Label>
          <Input
            type="file"
            id="file"
            name="file"
            disabled={isDisabled || progress !== null}
            onChange={handleFileUpload}
          />
        </div>

        {uploadedFile && (
          <Input
            type="hidden"
            id="productFile"
            name="productFile"
            value={JSON.stringify(uploadedFile)}
          />
        )}

        <div className="flex-grow space-y-2">
          <Label htmlFor="fileName">File Name</Label>
          <Input
            type="text"
            id="fileName"
            name="fileName"
            placeholder={uploadedFile?.name || "Default of uploaded file name"}
            disabled={isDisabled || progress !== null}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
      </div>

      {progress !== null && <Progress value={progress} />}
    </>
  );
}
