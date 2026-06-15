import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";
import {
  Bell,
  HelpCircle,
  LogOut,
  PanelLeft,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../store/layoutStore";
import UsersAPI from "@/api/users";

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
        className,
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
  const companyname =
    localStorage.getItem("company_name") || "Name of Company user belongs'";
  const userEmail = localStorage.getItem("user_email") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    UsersAPI.getCurrentUsers().then((response) => {
      const userData = response.data;
      console.log("Current User Data:", userData);
    });
  }, []);

  return (
    // <header className="flex h-[var(--header-height,2rem)] shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white px-[1.25rem]">
    <header className="px-2 py-1.75 flex justify-between bg-white border-b border-[#e0e0e0]">
      <div className="flex items-center gap-[0.25rem]">
        <HeaderIconButton
          label={isSidebarPinned ? "Unpin navigation" : "Pin navigation open"}
          onClick={toggleSidebarPinned}
          className={cn(
            isSidebarPinned && "text-main-theme bg-[rgba(31,157,91,0.1)]",
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
            className="w-[15rem] border border-[#e0e0e0] bg-white p-1 shadow-md"
            // min-w-[10rem]
          >
            <div className="flex gap-3 px-2 py-1.5">
              <div>
                <span className="capitalize flex size-[2.45rem] items-center justify-center overflow-hidden rounded-full bg-main-theme text-[0.75rem] font-semibold text-white">
                  {userName[0]}
                </span>
              </div>
              <div className="w-full">
                <div>
                  <p className="text-[0.85rem] font-normal">{userName}</p>
                  <p className="text-[0.75rem] font-normal text-[#666666] mt-[-0.2rem]">
                    {userEmail}
                  </p>
                </div>
                <div className="mt-2">
                  <DropdownMenuSeparator className="my-1 bg-[#e0e0e0] w-full" />
                  <p className="text-[0.76rem] mt-1.75">{companyname}</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="my-1 bg-[#e0e0e0]" />

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
