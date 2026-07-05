import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type PdfHighlight = {
  page: number;
  page_width?: number;
  page_height?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
};

type PdfViewerProps = {
  url: string;
  className?: string;
  highlight?: PdfHighlight | null;
};

const hasHighlightBox = (highlight: PdfHighlight) =>
  highlight.page_width != null &&
  highlight.page_height != null &&
  highlight.x0 != null &&
  highlight.y0 != null &&
  highlight.x1 != null &&
  highlight.y1 != null;

const getHighlightStyle = (
  highlight: PdfHighlight,
  renderedWidth: number,
): React.CSSProperties => {
  const { page_width, page_height, x0, y0, x1, y1 } = highlight;
  const scale = renderedWidth / page_width!;
  const left = x0! * scale;
  const top = (page_height! - y1!) * scale;
  const width = (x1! - x0!) * scale;
  const height = (y1! - y0!) * scale;

  return {
    position: "absolute",
    left,
    top,
    width,
    height,
    backgroundColor: "rgba(255, 235, 59, 0.4)",
    border: "2px solid rgba(255, 193, 7, 0.85)",
    pointerEvents: "none",
    zIndex: 10,
    borderRadius: 2,
  };
};

const PdfViewer = ({ url, className, highlight }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [containerWidth, setContainerWidth] = useState(500);

  useEffect(() => {
    setIsLoading(true);
    setNumPages(null);
  }, [url]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.max(entry.contentRect.width - 16, 120));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!highlight?.page || !numPages) return;

    const scrollToHighlight = () => {
      const pageEl = pageRefs.current.get(highlight.page);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToHighlight();
    const timer = window.setTimeout(scrollToHighlight, 300);
    return () => window.clearTimeout(timer);
  }, [highlight, numPages]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        height: "100%",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader className="size-4 animate-spin text-white" />
          <p style={{ fontSize: "0.85rem", color: "#fff" }}>
            Loading document...
          </p>
        </div>
      )}
      <Document
        file={url}
        onLoadSuccess={({ numPages: totalPages }) => {
          setNumPages(totalPages);
          setIsLoading(false);
        }}
        onLoadError={() => setIsLoading(false)}
        loading={null}
      >
        {Array.from(new Array(numPages), (_, index) => {
          const pageNumber = index + 1;
          const showHighlight =
            highlight?.page === pageNumber && hasHighlightBox(highlight);

          return (
            <div
              key={`page_${pageNumber}`}
              ref={(el) => {
                if (el) pageRefs.current.set(pageNumber, el);
              }}
              className="mb-4 shadow-sm"
              style={{ position: "relative" }}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer
                renderAnnotationLayer
                width={containerWidth}
              />
              {showHighlight && (
                <div style={getHighlightStyle(highlight, containerWidth)} />
              )}
            </div>
          );
        })}
      </Document>
    </div>
  );
};

export default PdfViewer;
