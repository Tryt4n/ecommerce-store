import React, { type ComponentProps } from "react";
import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size: ComponentProps<typeof Loader2>["size"];
} & ComponentProps<"div">;

export default function LoadingSpinner({
  size = 32,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div className="my-4 flex justify-center" {...props}>
      <Loader2 size={size} className="animate-spin" />
    </div>
  );
}
