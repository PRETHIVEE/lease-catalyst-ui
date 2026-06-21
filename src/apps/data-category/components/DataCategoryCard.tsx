import {
  Download,
  Eye,
  Grid2x2,
  Grid2x2Plus,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IconButton from "@/components/common/IconButton";
import StatusChip from "@/components/common/StatusChip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export type DataCategoryCardProps = {
  title: string;
  description: string;
  className?: string;
  isCustomCatgory?: boolean;
  status: string | null;
};

const DataCategoryCard = (props: DataCategoryCardProps) => {
  const {
    title,
    description,
    className,
    isCustomCatgory = false,
    status,
  } = props;

  const navigate = useNavigate();

  const handleNavigateToView = () => {
    if (status !== "pending") {
      navigate(`/data-category/view?mode=view&dc=${title}`);
    }
  };

  return (
    <article
      role={status !== "pending" ? "button" : undefined}
      tabIndex={status !== "pending" ? 0 : undefined}
      aria-label={status !== "pending" ? `View ${title}` : title}
      aria-disabled={status === "pending"}
      className={cn(
        "rounded-md shadow-card bg-white p-4",
        status !== "pending" && "cursor-pointer transition-colors hover:bg-slate-50",
        className,
      )}
      onClick={handleNavigateToView}
      onKeyDown={(event) => {
        if (status !== "pending" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          handleNavigateToView();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#f0fdf4] text-[#16a34a] [&_svg]:size-5"
        >
          {isCustomCatgory ? <Grid2x2Plus /> : <Grid2x2 />}
        </div>

        <div>
          {status === "pending" && (
            <StatusChip variant="pending" label="Pending" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={status === "pending"}>
              <IconButton
                disabled={status === "pending"}
                aria-label={`${title} options`}
                className="ml-2"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical className="size-4" aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuItem
                onSelect={() => {
                  navigate(`/data-category/view?mode=view&dc=${title}`);
                }}
              >
                <Eye aria-hidden className="mr-1.5" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  navigate(`/data-category/view?mode=modify&dc=${title}`);
                }}
              >
                <Pencil aria-hidden className="mr-1.5" />
                Copy & Modify
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => {}}>
                <Download aria-hidden className="mr-1.5" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3">
        <h6 className="text-[0.88rem] font-semibold text-font-color-primary">
          {title}
        </h6>
        <p className="mt-1 text-[0.82rem] leading-snug text-[#00000090] ">
          {description}
        </p>
      </div>
    </article>
  );
};

export default DataCategoryCard;
