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
import { Input } from "@/components/ui/input";
import { SendHorizontal, X } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface CreateProjectProps {
  open: boolean;
  onClose: () => void;
  drawerWidth?: "medium" | "large";
}

const CreateProject = ({
  open,
  onClose,
  //   drawerWidth = "medium",
}: CreateProjectProps) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Create Project" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4">
          <div>
            <InputLabel htmlFor="project-name" label="Project Name" />
            <Input id="project-name" />
          </div>
          <div className="mt-2.5">
            <InputLabel
              htmlFor="project-description"
              label="Project Description"
            />
            <Autocomplete
              options={["Hello world", "Other option"]}
              disableClearable
              //   value={"Hello world"}
              onChange={(_, newValue) => console.log(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
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
            <Button variant="primary">
              <SendHorizontal />
              Submit
            </Button>
          </DialogFooterWrapper>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateProject;
