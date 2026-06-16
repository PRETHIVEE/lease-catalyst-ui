import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const widgetCardVariants = cva(
  "flex items-center justify-between gap-4 rounded-md  bg-white p-4 shadow-sm"
);

const labelVariants = cva("text-[0.88rem] mt-1 mb-[-0.25rem]", {
  variants: {
    variant: {
      info: "text-[#2563eb]",
      warning: "text-[#ea580c]",
      error: "text-[#dc2626]",
      success: "text-[#16a34a]",
      neutral: "text-[#374151]",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const iconContainerVariants = cva(
  "flex size-11 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
  {
    variants: {
      variant: {
        info: "bg-[#eff6ff] text-[#2563eb]",
        warning: "bg-[#fff7ed] text-[#ea580c]",
        error: "bg-[#fef2f2] text-[#dc2626]",
        success: "bg-[#f0fdf4] text-[#16a34a]",
        neutral: "bg-[#f3f4f6] text-[#4b5563]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export type WidgetCardVariant = NonNullable<
  VariantProps<typeof labelVariants>["variant"]
>;

export type WidgetCardProps = {
  value: number | string;
  label: string;
  subDescription: string;
  icon: LucideIcon;
  className?: string;
} & VariantProps<typeof labelVariants>;

const WidgetCard = ({
  value,
  variant = "info",
  label,
  subDescription,
  icon: Icon,
  className,
}: WidgetCardProps) => {
  return (
    <article className={cn(widgetCardVariants(), className)}>
      <div className="flex min-w-0 flex-col gap-1 text-left">
        <p className="text-lg font-semibold leading-none tracking-tight text-[#111827]">
          {value}
        </p>
        <p className={cn(labelVariants({ variant }))}>{label}</p>
        <p className="text-[0.82rem] text-[#9ca3af]">{subDescription}</p>
      </div>
      <div aria-hidden className={cn(iconContainerVariants({ variant }))}>
        <Icon />
      </div>
    </article>
  );
};

export default WidgetCard;
