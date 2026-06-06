import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import NoDataFound from "@/components/common/NoDataFound";
import { cn } from "@/lib/utils";

export type PDFViewerProps = {
  url?: string;
  title?: string;
  className?: string;
};

const PDFViewer = ({
  url,
  title = "PDF preview",
  className,
}: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(Boolean(url));

  useEffect(() => {
    setIsLoading(Boolean(url));
  }, [url]);

  if (!url) {
    return (
      <div
        className={cn(
          "flex min-h-[480px] items-center justify-center rounded border border-[#e5e7eb] bg-[#f8fafc]",
          className
        )}
      >
        <NoDataFound message="No PDF available" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-[82vh] overflow-hidden rounded border border-[#e5e7eb] bg-[#f1f5f9]",
        className
      )}
    >
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#f1f5f9]"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader className="size-8 animate-spin text-[#6b7280]" aria-hidden />
          <p className="text-sm text-[#6b7280]">Loading PDF…</p>
        </div>
      )}
      <iframe
        title={title}
        src={url}
        className={cn(
          "h-[min(80vh,720px)] w-full min-h-[480px] border-0",
          isLoading && "invisible"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default PDFViewer;
