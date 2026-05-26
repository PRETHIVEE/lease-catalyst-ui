import type { ReactNode } from "react";
import { BadgeQuestionMark, Info, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import IconButton from "@/components/common/IconButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type IntegrationCardProps = {
  title: string;
  description: string;
  imgUrl: string;
  iconContainerClassName?: string;
  actionLabel?: string;
  className?: string;
  onInstall?: () => void;
  onViewDetails?: () => void;
  imgWidth?: string;
};

const IntegrationCard = ({
  title,
  description,
  imgUrl,
  className,
  onInstall,
  onViewDetails,
  imgWidth = "medium",
}: IntegrationCardProps) => {
  const isInstalled = title === "Salesforce";
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-card",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <img
              src={imgUrl}
              alt=""
              style={{ width: imgWidth === "medium" ? "3.75rem" : "6.5rem" }}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label={`${title} options`}>
                <MoreVertical className="size-4" aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuItem onSelect={onViewDetails}>
                <Info />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onViewDetails}>
                <BadgeQuestionMark />
                Help
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3">
          <h6 className="text-[0.88rem] font-semibold text-font-color-primary">
            {title}
          </h6>
          <p className="mt-1 text-[0.82rem] leading-snug text-[#00000090]">
            {description}
          </p>
        </div>
      </div>

      <div className="px-4 py-3">
        <Button
          type="button"
          variant={isInstalled ? "primary" : "outline"}
          onClick={onInstall}
          className="w-full rounded-full text-[0.85rem]"
        >
          {isInstalled ? "Connected" : "Connect"}
        </Button>
      </div>
    </article>
  );
};

export default IntegrationCard;
