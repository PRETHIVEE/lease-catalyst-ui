import CustomDialogTitle from "@/components/common/CustomDialogTitle";
import DialogFooterWrapper from "@/components/common/DialogFooterWrapper";
import InputLabel from "@/components/common/InputLabel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerContentArea,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import TextField from "@mui/material/TextField";
import { Check, Loader, X } from "lucide-react";
import { useEffect, useState } from "react";

export type SaveDrawerPayload = {
  name: string;
  description: string;
};

type SaveDrawerProps = {
  open: boolean;
  defaultName: string;
  onClose: () => void;
  onDone: (payload: SaveDrawerPayload) => void;
  isSubmitting: boolean;
};

const SaveDrawer = (props: SaveDrawerProps) => {
  const { open, defaultName, onClose, onDone, isSubmitting } = props;

  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(defaultName);
    setDescription("");
  }, [open, defaultName]);

  const canDone = Boolean(name.trim()) && Boolean(description.trim());

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle
              title="Save Data Category"
              handleClose={onClose}
            />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="form-container space-y-3 p-4">
          <div>
            <InputLabel htmlFor="save-dc-name" label="Data Category Name" />
            <TextField
              id="save-dc-name"
              size="small"
              fullWidth
              value={name}
              disabled={isSubmitting}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <InputLabel htmlFor="save-dc-description" label="Description" />
            <TextField
              id="save-dc-description"
              size="small"
              fullWidth
              multiline
              minRows={3}
              disabled={isSubmitting}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </DrawerContentArea>

        <DrawerFooter>
          <DialogFooterWrapper>
            <Button
              variant="outline"
              color="primary"
              className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="mr-1.5 size-4" />
              Cancel
            </Button>

            <Button
              variant="primary"
              type="button"
              style={{ width: "6.5rem" }}
              disabled={!canDone || isSubmitting}
              onClick={() =>
                onDone({
                  name: name.trim(),
                  description: description.trim(),
                })
              }
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-1.5 size-4" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="mr-1.5 size-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooterWrapper>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SaveDrawer;
