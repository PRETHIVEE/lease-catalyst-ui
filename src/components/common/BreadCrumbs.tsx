import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  url?: string;
};

export type BreadCrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

const BreadCrumbs = ({ items, className }: BreadCrumbsProps) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("w-fit", className)}>
      <ol className="inline-flex flex-wrap items-center gap-0.5 rounded border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 mx-[-2px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-0.5"
            >
              {index > 0 && (
                <ChevronRight
                  className="size-2.75 shrink-0 text-font-color-primary/60"
                  aria-hidden
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-[0.69rem]  leading-none text-font-color-primary"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url ?? "#"}
                  className="text-[0.69rem]  leading-none text-font-color-primary transition-colors hover:text-[#243b53]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
