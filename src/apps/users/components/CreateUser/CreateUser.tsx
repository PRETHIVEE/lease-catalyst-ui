/* eslint-disable @typescript-eslint/no-explicit-any */
import Autocomplete from "@mui/material/Autocomplete";
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

interface CreateProjectProps {
  open: boolean;
  onClose: () => void;
  formik: any;
  userRoleOptions: any[];
  isSubmitting: boolean;
}

const CreateUser = (props: CreateProjectProps) => {
  const { open, onClose, formik, userRoleOptions, isSubmitting } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Create User" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          <div>
            <InputLabel htmlFor="user-name" label="User Name" />
            <TextField
              id="user-name"
              size="small"
              fullWidth
              value={formik?.values?.userName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "userName",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
            />
          </div>

          <div className="mt-2.5">
            <InputLabel htmlFor="user-email" label="User Email" />
            <TextField
              id="user-email"
              size="small"
              fullWidth
              value={formik?.values?.userEmail}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "userEmail",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={
                formik.touched.userEmail && Boolean(formik.errors.userEmail)
              }
              helperText={formik.touched.userEmail && formik.errors.userEmail}
            />
          </div>
          <div className="mt-2.5">
            <InputLabel htmlFor="default-password" label="Default Password" />
            <TextField
              id="default-password"
              size="small"
              fullWidth
              value={formik?.values?.defaultPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik?.setFieldValue(
                  "defaultPassword",
                  trimLeadingSpace(event.target.value),
                );
              }}
              error={
                formik.touched.defaultPassword &&
                Boolean(formik.errors.defaultPassword)
              }
              helperText={
                formik.touched.defaultPassword && formik.errors.defaultPassword
              }
            />
          </div>
          <div className="mt-2.5">
            <InputLabel htmlFor="user-role" label="User Role" />
            <Autocomplete
              id="user-role"
              fullWidth
              disablePortal
              disableClearable
              options={userRoleOptions}
              disabled={userRoleOptions?.length === 0}
              getOptionLabel={(o) => o?.label}
              getOptionDisabled={(o) => o?.isDisabled}
              value={formik?.values?.userRole}
              onChange={(_e, newValue) => {
                formik?.setFieldValue("userRole", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  error={
                    formik.touched.userRole && Boolean(formik.errors.userRole)
                  }
                  helperText={formik.touched.userRole && formik.errors.userRole}
                />
              )}
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

export default CreateUser;
