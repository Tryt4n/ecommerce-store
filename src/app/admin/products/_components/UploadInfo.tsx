import React from "react";

type UploadInfoProps = {
  isFilesUploadDisabled: boolean;
  isAnyFileUploaded: boolean;
};

export default function UploadInfo({
  isFilesUploadDisabled,
  isAnyFileUploaded,
}: UploadInfoProps) {
  return (
    <div
      id="disabledInfo"
      className="space-y-2 text-pretty pt-2 text-sm font-semibold italic text-muted-foreground"
    >
      {isFilesUploadDisabled && (
        <p>Before adding any files, please provide a product name.</p>
      )}
      {isAnyFileUploaded && (
        <p>
          Once the files have been uploaded, you{" "}
          <span className="font-bold text-black">will not be able</span> to
          change the product name.
        </p>
      )}
    </div>
  );
}
