import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Bell, HelpCircle, LogOut, PanelLeft, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        "flex size-[2rem] items-center justify-center rounded-md text-[#666666] transition-colors hover:bg-[#f3f4f6] hover:text-[#333333] cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { toggleSidebarPinned, isSidebarPinned } = useLayoutStore();
  const userName = localStorage.getItem("user_name") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    // <header className="flex h-[var(--header-height,2rem)] shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white px-[1.25rem]">
    <header className="px-2 py-1.75 flex justify-between bg-white border-b border-[#e0e0e0]">
      <div className="flex items-center gap-[0.25rem]">
        <HeaderIconButton
          label={isSidebarPinned ? "Unpin navigation" : "Pin navigation open"}
          onClick={toggleSidebarPinned}
          className={cn(
            isSidebarPinned && "text-main-theme bg-[rgba(31,157,91,0.1)]"
          )}
        >
          <PanelLeft className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
        </HeaderIconButton>

        <HeaderIconButton label="Help">
          <Search className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
        </HeaderIconButton>
      </div>

      <div className="flex items-center gap-[0rem]">
        <HeaderIconButton label="Help">
          <Bell className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
        </HeaderIconButton>

        <HeaderIconButton label="Help">
          <HelpCircle
            className="size-[1.1rem]"
            strokeWidth={1.75}
            aria-hidden
          />
        </HeaderIconButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-[0.5rem] flex h-[2rem] cursor-pointer items-center gap-[0.5rem] rounded-full border border-[#e0e0e0] py-[0.25rem] pl-[1rem] pr-[0.25rem] text-[0.78rem] outline-none"
              aria-label="User menu"
            >
              <span className="capitalize">{userName}</span>

              <span className="capitalize flex size-[1.45rem] items-center justify-center overflow-hidden rounded-full bg-main-theme text-[0.75rem] font-semibold text-white">
                {userName[0]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[10rem] border border-[#e0e0e0] bg-white p-1 shadow-md"
          >
            <DropdownMenuItem onSelect={() => {}}>
              <User aria-hidden />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-[#e0e0e0]" />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut aria-hidden />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
