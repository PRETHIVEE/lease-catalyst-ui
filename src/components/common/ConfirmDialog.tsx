import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  subtitle: string;
  open: boolean;
  isSubmitting?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

export function ConfirmDialog({
  title,
  subtitle,
  open,
  isSubmitting = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  handleClose,
  handleConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="bg-white sm:max-w-md"
        overlayClassName="supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          <DialogDescription>
            {<p className="text-[0.90rem]">{subtitle}</p>}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="-mx-4 -mb-4 border-none bg-white px-4 py-2 pb-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[0.82rem] mr-1 h-7.25"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="text-[0.82rem] h-7.25"
          >
            {isSubmitting ? <Loader className="animate-spin" /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
