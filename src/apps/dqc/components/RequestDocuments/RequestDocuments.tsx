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
// import Autocomplete from "@mui/material/Autocomplete";

interface RequestDocumentsProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  propertyName: string;
}

const RequestDocuments = (props: RequestDocumentsProps) => {
  const { open, onClose, isSubmitting, propertyName } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle
              title="Request Documents from Client"
              handleClose={onClose}
            />
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

          {/* <div className="mt-2.5">
            <InputLabel htmlFor="select-client" label="Select Client" />
            <Autocomplete
              id="select-client"
              fullWidth
              disablePortal
              disableClearable
              options={["All (Everyone)", "Client One", "Client Two", "Client Three"]}
              // value={formik?.values?.template}
              // onChange={(_e, newValue) => {
              //   // formik?.setFieldValue("template", newValue);
              // }}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </div> */}

          <div className="mt-2.5">
            <InputLabel htmlFor="description" label="Description" />
            <TextField
              id="description"
              size="small"
              fullWidth
              multiline
              minRows={3}
              // value={attributeDescription}
              // onChange={(event) => setAttributeDescription(event.target.value)}
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
              // onClick={() => handleUpload()}
              // disabled={isSubmitting || uploadDocuments.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader />
                  Uploading
                </>
              ) : (
                <>
                  <SendHorizontal />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooterWrapper>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RequestDocuments;
