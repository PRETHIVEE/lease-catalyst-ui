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
import { trimLeadingSpace } from "@/utils/utils";

interface CreateCompanyProps {
  open: boolean;
  onClose: () => void;
  formik: any;
  isSubmitting: boolean;
}

const CreateCompany = (props: CreateCompanyProps) => {
  const { open, onClose, formik, isSubmitting } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Create Company" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          <div>
            <InputLabel htmlFor="company-name" label="Company Name" />
            <TextField
              id="company-name"
              size="small"
              fullWidth
              value={formik?.values?.companyName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "companyName",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={formik.touched.companyName && Boolean(formik.errors.companyName)}
              helperText={formik.touched.companyName && formik.errors.companyName}
            />
          </div>

          
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
              onClick={() => formik.handleSubmit()}
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

export default CreateCompany;
