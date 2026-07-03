import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const statusChipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-[0.72rem]  leading-none [&_svg]:size-3.25 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        new: "border-[var(--status-chip-progress-border)] bg-[var(--status-chip-progress-bg)] text-[var(--status-chip-progress-fg)]",
        ready:
          "border-[var(--status-chip-ready-border)] bg-[var(--status-chip-ready-bg)] text-[var(--status-chip-ready-fg)]",
        pending:
          "border-[var(--status-chip-pending-border)] bg-[var(--status-chip-pending-bg)] text-[var(--status-chip-pending-fg)]",
        failed:
          "border-[var(--status-chip-failed-border)] bg-[var(--status-chip-failed-bg)] text-[var(--status-chip-failed-fg)]",
        success:
          "border-[var(--status-chip-success-border)] bg-[var(--status-chip-success-bg)] text-[var(--status-chip-success-fg)]",
        expired:
          "border-[var(--status-chip-expired-border)] bg-[var(--status-chip-expired-bg)] text-[var(--status-chip-expired-fg)]",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
);

// const defaultIcons: Record<
//   NonNullable<VariantProps<typeof statusChipVariants>["variant"]>,
//   LucideIcon
// > = {
//   pending: Clock,
//   progress: Loader,
//   submitted: Send,
//   failed: CircleX,
//   success: BadgeCheck,
//   expired: Ban,
// };

export type StatusChipVariant = NonNullable<
  VariantProps<typeof statusChipVariants>["variant"]
>;

export type StatusChipProps = {
  label: string;
  icon?: LucideIcon;
  className?: string;
  showIcon?: boolean;
} & VariantProps<typeof statusChipVariants>;

const StatusChip = ({
  variant = "pending",
  label,
  // icon,
  className,
}: // showIcon = true,
StatusChipProps) => {
  // const Icon = icon ?? defaultIcons[variant ?? "pending"];

  return (
    <span className={cn(statusChipVariants({ variant }), className)}>
      {/* {showIcon && <Icon aria-hidden />} */}
      {label}
    </span>
  );
};

export default StatusChip;
