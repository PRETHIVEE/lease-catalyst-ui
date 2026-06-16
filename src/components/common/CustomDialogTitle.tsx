import type { FC } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";

interface CustomDialogTitleProps {
  title: string;
  handleClose: () => void;
}

const CustomDialogTitle: FC<CustomDialogTitleProps> = ({
  title,
  handleClose,
}) => {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2.5 border-[#cfd0d0]">
      <h3 className="text-[0.9rem] font-medium leading-none tracking-tight">
        {title}
      </h3>
      <IconButton aria-label="close-button" onClick={handleClose}>
        <X className="size-4" />
      </IconButton>
    </div>
  );
};

export default CustomDialogTitle;
