import IconButton from "@/components/common/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip } from "@mui/material";
import {
  Building2,
  Calendar,
  Ellipsis,
  Plus,
  ShieldUser,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ProjectWidgetProps = {
  projectId: number;
  companyName: string;
  dataCategory: string;
  propertiesCount: number;
  date: string;
  className?: string;
  onDelete?: (projectId: number) => void;
};

const ProjectWidget = ({
  projectId,
  companyName,
  dataCategory,
  propertiesCount,
  date,
  className,
  onDelete,
}: ProjectWidgetProps) => {
  const navigate = useNavigate();
  const companyInitial = companyName.trim().charAt(0).toUpperCase() || "?";

  const openProjectDetails = (tab?: string) => {
    navigate(`/projects/project-details?projectId=${projectId}`, {
      state: tab ? { tab } : undefined,
    });
  };

  return (
    <article
      className={cn(
        "w-full max-w-md overflow-hidden rounded-md border border-[#E5E7EB] bg-white shadow-card",
        className
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${companyName}`}
        className="cursor-pointer p-4 transition-colors hover:bg-slate-50"
        onClick={() => openProjectDetails()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProjectDetails();
          }
        }}
      >
        <div>
          <div className="flex w-full items-center gap-2 border-b border-slate-300 pb-2">
            <div
              aria-hidden
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                "bg-main-theme"
              )}
            >
              {companyInitial}
            </div>
            <h6 className="truncate text-[0.9rem] font-semibold text-font-color-primary">
              {companyName}
            </h6>
          </div>

          <div className="mt-1.5 pl-2">
            <p className="mt-0.5 truncate text-[0.78rem] text-slate-600">
              {dataCategory}
            </p>
          </div>
        </div>

        <div className="mt-3 mb-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[#33333399]">
            <Building2 className="size-4 shrink-0" aria-hidden />
            <span className="text-[0.82rem] font-normal text-slate-600">
              {propertiesCount} {propertiesCount === 1 ? "Lease" : "Leases"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#33333390]">
            <Calendar className="size-4 shrink-0" aria-hidden />
            <span className="text-[0.78rem] whitespace-nowrap">{date}</span>
          </div>
        </div>
      </div>

      <footer className="flex items-stretch border-t border-[#E5E7EB]  bg-[#1f9d5b10]">
        <div className="flex flex-1 items-center px-3 py-2">
          <Tooltip title="Open Project" arrow placement="right">
            <IconButton
              aria-label="Open project"
              onClick={() => openProjectDetails()}
            >
              <SquareArrowOutUpRight className="size-4" aria-hidden />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex items-center border-l border-[#E5E7EB] px-1.5 py-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label="Project options">
                <Ellipsis className="size-4" aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuItem
                onSelect={() => openProjectDetails("properties")}
              >
                <Plus aria-hidden className="mr-1.5" />
                Add Property / Lease
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => openProjectDetails("user-access")}
              >
                <ShieldUser aria-hidden className="mr-1.5" />
                User Access
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDelete?.(projectId)}
              >
                <Trash2 aria-hidden className="mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </footer>
    </article>
  );
};

export default ProjectWidget;
