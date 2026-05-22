import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type IconButtonProps = {
  "aria-label": string;
  children: ReactNode;
  className?: string;
} & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "onClick" | "type"
>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { children, className, disabled, onClick, type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "cursor-pointer shrink-0 rounded-xs p-1 text-[#3c3c3c] transition-colors hover:bg-slate-100 hover:text-[#374151] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
