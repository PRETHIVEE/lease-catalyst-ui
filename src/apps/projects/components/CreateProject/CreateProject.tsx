/* eslint-disable @typescript-eslint/no-explicit-any */
// import CustomDialogTitle from "@/components/common/CustomDialogTitle";
// import DialogFooterWrapper from "@/components/common/DialogFooterWrapper";
// import InputLabel from "@/components/common/InputLabel";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerContentArea,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { SendHorizontal, X } from "lucide-react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";

// interface CreateProjectProps {
//   open: boolean;
//   onClose: () => void;
//   drawerWidth?: "medium" | "large";
// }

// const CreateProject = ({
//   open,
//   onClose,
//   //   drawerWidth = "medium",
// }: CreateProjectProps) => {
//   return (
//     <Drawer open={open} onOpenChange={onClose}>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>
//             <CustomDialogTitle title="Create Project" handleClose={onClose} />
//           </DrawerTitle>
//         </DrawerHeader>

//         <DrawerContentArea className="p-4">
//           <div>
//             <InputLabel htmlFor="project-name" label="Project Name" />
//             <Input id="project-name" />
//           </div>
//           <div className="mt-2.5">
//             <InputLabel
//               htmlFor="project-description"
//               label="Project Description"
//             />
//             <Autocomplete
//               options={["Hello world", "Other option"]}
//               disableClearable
//               //   value={"Hello world"}
//               onChange={(_, newValue) => console.log(newValue)}
//               renderInput={(params) => <TextField {...params} size="small" />}
//             />
//           </div>
//         </DrawerContentArea>

//         <DrawerFooter>
//           <DialogFooterWrapper>
//             <Button
//               variant="outline"
//               color="primary"
//               className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
//               onClick={onClose}
//             >
//               <X />
//               Cancel
//             </Button>
//             <Button variant="primary">
//               <SendHorizontal />
//               Submit
//             </Button>
//           </DialogFooterWrapper>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default CreateProject;

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
  dataCategoryOptions: any[];
  isSubmitting: boolean;
}

const CreateProject = (props: CreateProjectProps) => {
  const { open, onClose, formik, dataCategoryOptions, isSubmitting } = props;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Create Project" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea className="p-4 form-container">
          <div>
            <InputLabel htmlFor="project-name" label="Project Name" />
            <TextField
              id="project-name"
              size="small"
              fullWidth
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

          <div className="mt-2.5">
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

export default CreateProject;
