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
import { CloudUpload, Loader, X } from "lucide-react";
import UploadArea from "@/components/common/UploadArea";
import type { Dispatch, SetStateAction } from "react";

interface UploadFilesProps {
  open: boolean;
  onClose: () => void;
  handleUpload: () => void;
  isSubmitting: boolean;
  propertyName: string;
  uploadDocuments: File[];
  setUploadDocuments: Dispatch<SetStateAction<File[]>>;
  componentLocation: "DQC" | "PROPERTY DETAILS";
  isTriggeringJob?: boolean;
}

const UploadFiles = (props: UploadFilesProps) => {
  const {
    open,
    onClose,
    isSubmitting,
    propertyName,
    uploadDocuments,
    setUploadDocuments,
    handleUpload,
    componentLocation,
    isTriggeringJob = false,
  } = props;
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

          <div className="mt-3">
            <UploadArea
              uploadDocuments={uploadDocuments}
              setUploadDocuments={setUploadDocuments}
              // supportedFormats={["xls", "xlsx", "pdf"]}
              supportedFormats={["pdf"]}
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
              onClick={() => handleUpload()}
              disabled={isSubmitting || uploadDocuments.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader />
                  {componentLocation === "DQC" ? (
                    <>
                      {isTriggeringJob
                        ? "Running DQC"
                        : "Uploading"}
                    </>
                  ) : (
                    "Uploading"
                  )}
                </>
              ) : (
                <>
                  <CloudUpload />
                  {componentLocation === "DQC" ? "Upload & Run DQC" : "Upload"}
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
