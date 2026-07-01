import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  url: string;
  className?: string;
};

const PdfViewer = ({ url, className }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
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
          <Loader className="size-4 animate-spin" />
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
        {Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="mb-4 shadow-sm">
            <Page
              pageNumber={index + 1}
              renderTextLayer
              renderAnnotationLayer
              width={containerWidth}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
