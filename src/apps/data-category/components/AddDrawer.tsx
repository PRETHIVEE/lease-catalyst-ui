import InputLabel from "@/components/common/InputLabel";
import {
  Drawer,
  DrawerContent,
  DrawerContentArea,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import CustomDialogTitle from "@/components/common/CustomDialogTitle";
import TextField from "@mui/material/TextField";
import DialogFooterWrapper from "@/components/common/DialogFooterWrapper";

type DrawerMode = "group" | "subgroup" | "attribute";

export type AddDrawerPayload = {
  name: string;
  attributeDescription?: string;
};

type AddDrawerProps = {
  open: boolean;
  mode: DrawerMode | null;
  onClose: () => void;
  onSave: (payload: AddDrawerPayload) => void;
};

const AddDrawer = (props: AddDrawerProps) => {
  const { open, mode, onClose, onSave } = props;

  const [name, setName] = useState("");
  const [attributeDescription, setAttributeDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setAttributeDescription("");
  }, [open, mode]);

  const drawerTitle =
    mode === "group"
      ? "Add Group"
      : mode === "subgroup"
      ? "Add Subgroup"
      : mode === "attribute"
      ? "Add Attribute"
      : "";

  const canSave = Boolean(name.trim()) && mode !== null;

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
            <CustomDialogTitle title={drawerTitle} handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 space-y-3 form-container">
          <div>
            <InputLabel htmlFor="dc-name" label="Name" />

            <TextField
              id="project-name"
              size="small"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {mode === "attribute" && (
            <div>
              <InputLabel
                htmlFor="dc-attr-desc"
                label="Attribute description"
              />

              <TextField
                id="dc-attr-desc"
                size="small"
                fullWidth
                multiline
                minRows={3}
                value={attributeDescription}
                onChange={(event) =>
                  setAttributeDescription(event.target.value)
                }
              />
            </div>
          )}
        </DrawerContentArea>

        <DrawerFooter>
          <DialogFooterWrapper>
            <Button
              variant="outline"
              color="primary"
              className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
              type="button"
              onClick={onClose}
            >
              <X className="mr-1.5 size-4" />
              Cancel
            </Button>

            <Button
              variant="primary"
              type="button"
              style={{ width: "6.5rem" }}
              onClick={() =>
                onSave({
                  name: name.trim(),
                  attributeDescription:
                    mode === "attribute" ? attributeDescription.trim() : "",
                })
              }
              disabled={!canSave}
            >
              Add
            </Button>
          </DialogFooterWrapper>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddDrawer;
