import React from "react";
import XButton from "@/components/ui/XButton";
import type { UploadedFile } from "@/lib/imagekit/type";

type CurrentFilePreviewProps = {
  file: NonNullable<UploadedFile>;
  setFile: React.Dispatch<React.SetStateAction<UploadedFile>>;
};

export default function CurrentFilePreview({
  file,
  setFile,
}: CurrentFilePreviewProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <p className="text-sm leading-4 text-muted-foreground">
        Current File: {file.name}
      </p>

      <XButton
        variant={"ghost"}
        size={"icon"}
        className="h-[16px] w-[16px]"
        onClick={() => {
          setFile(null);
        }}
        iconStyle={{ size: 16, className: "text-red-500" }}
      />
    </div>
  );
}
