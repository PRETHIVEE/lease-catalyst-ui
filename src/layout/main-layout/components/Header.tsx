import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Bell, HelpCircle, Menu, MessageCircle, Search } from "lucide-react";
import { useLayoutStore } from "../store/layoutStore";

type IconButtonProps = {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

function HeaderIconButton({
  label,
  onClick,
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-[2.25rem] items-center justify-center rounded-md text-[#666666] transition-colors hover:bg-[#f3f4f6] hover:text-[#333333]",
        className
      )}
    >
      {children}
    </button>
  );
}

function Badge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "absolute -top-0.5 -right-0.5 flex min-w-[1.125rem] h-[1.125rem] items-center justify-center rounded-full bg-[#e53e3e] px-0.5 text-[0.625rem] font-semibold leading-none text-white",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const { toggleSidebarPinned, isSidebarPinned } = useLayoutStore();

  return (
    <header className="flex h-[var(--header-height,4rem)] shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white px-[1.25rem]">
      <div className="flex items-center gap-[0.25rem]">
        <HeaderIconButton
          label={isSidebarPinned ? "Unpin navigation" : "Pin navigation open"}
          onClick={toggleSidebarPinned}
          className={cn(
            isSidebarPinned && "text-main-theme bg-[rgba(31,157,91,0.1)]"
          )}
        >
          <Menu className="size-[1.25rem]" aria-hidden />
        </HeaderIconButton>

        <HeaderIconButton label="Notifications">
          <span className="relative">
            <Bell className="size-[1.25rem]" aria-hidden />
            <Badge count={35} />
          </span>
        </HeaderIconButton>

        <HeaderIconButton label="Search">
          <Search className="size-[1.25rem]" aria-hidden />
        </HeaderIconButton>
      </div>

      <div className="flex items-center gap-[0.5rem]">
        <HeaderIconButton label="Messages">
          <span className="relative">
            <MessageCircle className="size-[1.25rem]" aria-hidden />
            <Badge count={3} />
          </span>
        </HeaderIconButton>

        <HeaderIconButton label="Help">
          <HelpCircle className="size-[1.25rem]" aria-hidden />
        </HeaderIconButton>

        <button
          type="button"
          className="ml-[0.5rem] flex h-[2.5rem] items-center gap-[0.625rem] rounded-full border border-[#e0e0e0] bg-white py-[0.25rem] pl-[1rem] pr-[0.25rem] text-[0.9375rem] font-medium text-[#333333] transition-colors hover:bg-[#f9fafb]"
          aria-label="User menu"
        >
          <span>Mike</span>
          <span className="flex size-[2rem] items-center justify-center overflow-hidden rounded-full bg-main-theme text-[0.75rem] font-semibold text-white">
            M
          </span>
        </button>
      </div>
    </header>
  );
}
