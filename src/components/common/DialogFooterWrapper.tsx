import type { ReactNode } from "react";

interface DialogFooterWrapperProps {
  children: ReactNode;
}

const DialogFooterWrapper = ({ children }: DialogFooterWrapperProps) => {
  return <div className="w-full flex justify-end gap-3 px-4 py-2.5 border-t border-[#cfd0d0]">{children}</div>;
};

export default DialogFooterWrapper;
