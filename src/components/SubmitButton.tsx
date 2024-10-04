"use client";

import React, { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  initialText?: string;
  pendingText?: string;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  edit?: boolean;
};

export default function SubmitButton({
  initialText,
  pendingText,
  className,
  size,
  edit,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={size}
      disabled={pending}
      variant="default"
      className={className}
    >
      {pending
        ? pendingText
          ? pendingText
          : edit
            ? "Editing..."
            : "Saving..."
        : initialText
          ? initialText
          : edit
            ? "Edit"
            : "Save"}
    </Button>
  );
}
