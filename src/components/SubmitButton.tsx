"use client";

import React, { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  initialText?: string;
  pendingText?: string;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
};

export default function SubmitButton({
  initialText,
  pendingText,
  className,
  size,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={size}
      disabled={pending}
      variant={pending ? "ghost" : "default"}
      className={className}
    >
      {pending
        ? pendingText
          ? pendingText
          : "Saving..."
        : initialText
          ? initialText
          : "Save"}
    </Button>
  );
}
