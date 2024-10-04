import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";

type CustomAlertDialogProps = {
  triggerElement: React.ReactNode;
  triggerElementDisabled?: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  onCancel?: () => void;
  actionButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  cancelButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
};

export function CustomAlertDialog({
  triggerElement,
  triggerElementDisabled,
  title,
  description,
  actionText,
  cancelText,
  onAction,
  onCancel,
  actionButtonVariant = "default",
  cancelButtonVariant = "ghost",
}: CustomAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: cancelButtonVariant })}
            disabled={triggerElementDisabled}
            onClick={onCancel}
          >
            {cancelText ? cancelText : "Cancel"}
          </AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: actionButtonVariant })}
            disabled={triggerElementDisabled}
            onClick={onAction}
          >
            {actionText ? actionText : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
