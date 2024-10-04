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

type CustomAlertDialogProps = {
  triggerElement: React.ReactNode;
  triggerElementDisabled?: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  onCancel?: () => void;
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
          <AlertDialogCancel onClick={onCancel}>
            {cancelText ? cancelText : "Cancel"}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onAction}
            disabled={triggerElementDisabled}
          >
            {actionText ? actionText : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
