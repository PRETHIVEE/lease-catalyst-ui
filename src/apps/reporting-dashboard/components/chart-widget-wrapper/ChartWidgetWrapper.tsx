import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ChartWidgetWrapperProps = {
  children: ReactNode;
  className?: string;
};

const ChartWidgetWrapper = ({
  children,
  className,
}: ChartWidgetWrapperProps) => {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-md bg-white p-4 shadow-card",
        className
      )}
    >
      {children}
    </article>
  );
};

export default ChartWidgetWrapper;
