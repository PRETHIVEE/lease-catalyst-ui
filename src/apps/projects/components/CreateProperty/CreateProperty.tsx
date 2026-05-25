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

interface CreatePropertyProps {
  open: boolean;
  onClose: () => void;
  formik: any;
  isSubmitting: boolean;
}

const CreateProperty = (props: CreatePropertyProps) => {
  const { open, onClose, formik, isSubmitting } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Create Property" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          <div>
            <InputLabel htmlFor="project-name" label="Project Name" />
            <TextField
              id="project-name"
              size="small"
              fullWidth
              disabled
              value={formik?.values?.projectName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "projectName",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={
                formik.touched.projectName && Boolean(formik.errors.projectName)
              }
              helperText={
                formik.touched.projectName && formik.errors.projectName
              }
            />
          </div>

          {/* Property Name */}
          <div className="mt-2.5">
            <InputLabel htmlFor="property-name" label="Property Name" />
            <TextField
              id="property-name"
              size="small"
              fullWidth
              value={formik?.values?.propertyName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "propertyName",
                  trimLeadingSpace(event.target.value),
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
                  trimLeadingSpace(event.target.value),
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
                  trimLeadingSpace(event.target.value),
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
            <InputLabel htmlFor="lease-id" label="Lease Id" />
            <TextField
              id="lease-id"
              size="small"
              fullWidth
              value={formik?.values?.leaseId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "leaseId",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={formik.touched.leaseId && Boolean(formik.errors.leaseId)}
              helperText={formik.touched.leaseId && formik.errors.leaseId}
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

export default CreateProperty;
