import React, { type ComponentProps } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

type XButtonProps = ComponentProps<typeof Button>;

export default function XButton({ ...props }: XButtonProps) {
  return (
    <Button
      type="button"
      variant="destructive"
      className="z-100 absolute right-0 top-0 h-[32px] w-[32px] p-1"
      {...props}
    >
      <X />
    </Button>
  );
}
