/* eslint-disable @typescript-eslint/no-explicit-any */
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
import UploadArea from "@/components/common/UploadArea";
import type { Dispatch, SetStateAction } from "react";
import { FormHelperText } from "@mui/material";

interface CreatePropertyProps {
  open: boolean;
  onClose: () => void;
  formik: any;
  isSubmitting: boolean;
  uploadDocuments: File[];
  setUploadDocuments: Dispatch<SetStateAction<File[]>>;
}

const CreateProperty = (props: CreatePropertyProps) => {
  const {
    open,
    onClose,
    formik,
    isSubmitting,
    uploadDocuments,
    setUploadDocuments,
  } = props;

  console.log("formik.errors", formik.errors);

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle
              title="Create Property / Lease"
              handleClose={onClose}
            />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          {/* Property Name */}
          <div className="mt-1">
            <InputLabel htmlFor="property-name" label="Property / Lease Name" />
            <TextField
              id="property-name"
              size="small"
              fullWidth
              value={formik?.values?.propertyName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "propertyName",
                  trimLeadingSpace(event.target.value)
                );
              }}
              error={
                formik.touched.propertyName &&
                Boolean(formik.errors.propertyName)
              }
              helperText={
                formik.touched.propertyName && formik.errors.propertyName
              }
            />
          </div>

          {/* Property ID */}
          <div className="mt-2.5">
            <InputLabel htmlFor="property-id" label="Property ID" />
            <TextField
              id="property-id"
              size="small"
              fullWidth
              value={formik?.values?.propertyId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "propertyId",
                  trimLeadingSpace(event.target.value)
                );
              }}
              error={
                formik.touched.propertyId && Boolean(formik.errors.propertyId)
              }
              helperText={formik.touched.propertyId && formik.errors.propertyId}
            />
          </div>

          {/* Tenant Name */}
          <div className="mt-2.5">
            <InputLabel htmlFor="tenant-name" label="Tenant Name" />
            <TextField
              id="tenant-name"
              size="small"
              fullWidth
              value={formik?.values?.tenantName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "tenantName",
                  trimLeadingSpace(event.target.value)
                );
              }}
              error={
                formik.touched.tenantName && Boolean(formik.errors.tenantName)
              }
              helperText={formik.touched.tenantName && formik.errors.tenantName}
            />
          </div>

          {/* Lease Id */}
          <div className="mt-2.5">
            <InputLabel htmlFor="lease-id" label="Lease ID" />
            <TextField
              id="lease-id"
              size="small"
              fullWidth
              value={formik?.values?.leaseId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "leaseId",
                  trimLeadingSpace(event.target.value)
                );
              }}
              error={formik.touched.leaseId && Boolean(formik.errors.leaseId)}
              helperText={formik.touched.leaseId && formik.errors.leaseId}
            />
          </div>

          <div className="mt-3">
            <InputLabel htmlFor="scope-document" label="Scope document" />
            <UploadArea
              uploadDocuments={uploadDocuments}
              setUploadDocuments={setUploadDocuments}
              isLoading={isSubmitting}
              // supportedFormats={["xls", "xlsx", "pdf"]}
              supportedFormats={["pdf"]}
              maxFiles={10} // Maximum number of files to upload
            />
            {formik.touched.camFiles && formik.errors.camFiles && (
              <FormHelperText error={true}>
                {formik.errors.camFiles}
              </FormHelperText>
            )}
            {/* {formik.touched.camFiles && formik.errors.camFiles && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.camFiles}
              </p>
            )} */}
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

export default CreateProperty;
