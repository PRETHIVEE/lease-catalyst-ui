import TextField from "@mui/material/TextField";
import {
  Drawer,
  DrawerContent,
  DrawerContentArea,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CustomDialogTitle from "@/components/common/CustomDialogTitle";
import InputLabel from "@/components/common/InputLabel";
import DialogFooterWrapper from "@/components/common/DialogFooterWrapper";
import { Button } from "@/components/ui/button";
import { Loader, SendHorizontal, X } from "lucide-react";

interface UploadFilesProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  propertyName: string;
}

const UploadFiles = (props: UploadFilesProps) => {
  const { open, onClose, isSubmitting, propertyName } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Upload Files" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          <div>
            <InputLabel htmlFor="property-name" label="Property Name" />
            <TextField
              id="property-name"
              size="small"
              fullWidth
              disabled
              value={propertyName}
            />
          </div>

          {/*<div className="mt-2.5">
            <InputLabel htmlFor="data-category" label="Data Category" />
            <Autocomplete
              id="data-category"
              fullWidth
              disablePortal
              disableClearable
              options={dataCategoryOptions}
              getOptionLabel={(o) => o?.attribute}
              getOptionDisabled={(o) => o?.status === "pending"}
              value={formik?.values?.template}
              onChange={(_e, newValue) => {
                formik?.setFieldValue("template", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  error={
                    formik.touched.template && Boolean(formik.errors.template)
                  }
                  helperText={formik.touched.template && formik.errors.template}
                />
              )}
            />
          </div> */}
        </DrawerContentArea>

        <DrawerFooter>
          <DialogFooterWrapper>
            <Button
              variant="outline"
              color="primary"
              className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
              onClick={onClose}
            >
              <X />
              Cancel
            </Button>
            <Button
              variant="primary"
              // onClick={() => formik.handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader />
                  Creating
                </>
              ) : (
                <>
                  <SendHorizontal />
                  Create
                </>
              )}
            </Button>
          </DialogFooterWrapper>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UploadFiles;
