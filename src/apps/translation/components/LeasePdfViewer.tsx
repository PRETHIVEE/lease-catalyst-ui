import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LeasePdfViewer({
  url,
  url2,
}: {
  url: string;
  url2: string;
}) {
  const [numPages1, setNumPages1] = useState<number | null>(null);
  const [numPages2, setNumPages2] = useState<number | null>(null);
  const [isLoading1, setIsLoading1] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  const [scale, setScale] = useState<number>(1.0);
  const [isSyncScroll, setIsSyncScroll] = useState<boolean>(true);
  const [page1, setPage1] = useState<number>(1);
  const [page2, setPage2] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const [baseWidth1, setBaseWidth1] = useState<number>(500);
  const [baseWidth2, setBaseWidth2] = useState<number>(500);
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  const isScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    const updateIsNarrow = () => setIsNarrow(window.innerWidth < 960);
    updateIsNarrow();
    window.addEventListener("resize", updateIsNarrow);
    return () => window.removeEventListener("resize", updateIsNarrow);
  }, []);

  useEffect(() => {
    const observeTarget = (
      ref: React.RefObject<HTMLDivElement | null>,
      setWidth: (w: number) => void,
    ) => {
      if (!ref.current) return;
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setWidth(Math.max(entry.contentRect.width - 24, 120));
        }
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    };

    const clean1 = observeTarget(containerRef1, setBaseWidth1);
    const clean2 = observeTarget(containerRef2, setBaseWidth2);

    return () => {
      if (clean1) clean1();
      if (clean2) clean2();
    };
  }, []);

  // Synchronized Scrolling Logic
  const handleScroll = (
    sourceRef: React.RefObject<HTMLDivElement | null>,
    targetRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!isSyncScroll || isScrollingRef.current) return;

    if (sourceRef.current && targetRef.current) {
      isScrollingRef.current = true;
      const source = sourceRef.current;
      const target = targetRef.current;
      const sourceMaxScroll = source.scrollHeight - source.clientHeight;
      const targetMaxScroll = target.scrollHeight - target.clientHeight;

      if (sourceMaxScroll > 0 && targetMaxScroll > 0) {
        const percentage = source.scrollTop / sourceMaxScroll;
        target.scrollTop = percentage * targetMaxScroll;
      }

      window.requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    }
  };

  // Zoom Operations
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  // Programmatic Scrolling Navigation helper
  const scrollToPage = (pageNumber: number) => {
    const container = containerRef1.current;
    if (!container || !numPages1) return;

    // Approximate target location by dividing overall height by page size ratio
    const targetTop = (container.scrollHeight / numPages1) * (pageNumber - 1);
    container.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  // Pagination Actions
  const handlePrev = () => {
    if (page1 > 1) {
      const nextPage = page1 - 1;
      setPage1(nextPage);
      setInputPage(nextPage.toString());
      scrollToPage(nextPage);
    }
  };

  const handleNext = () => {
    if (numPages1 && page1 < numPages1) {
      const nextPage = page1 + 1;
      setPage1(nextPage);
      setInputPage(nextPage.toString());
      scrollToPage(nextPage);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsedPage = parseInt(inputPage, 10);
      if (numPages1 && parsedPage >= 1 && parsedPage <= numPages1) {
        setPage1(parsedPage);
        scrollToPage(parsedPage);
      } else {
        setInputPage(page1.toString()); // Reset to valid value
      }
    }
  };

  // const url =
  //   "https://asg-bot-cache.s3.us-east-2.amazonaws.com/ASG_MVP/LeaseCat/translation/6/20260601_072636/sciencebook%20from%20wiki_translated_hin%20-%20Copy.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUXFBSAJOPLVBKMUR%2F20260614%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260614T170908Z&X-Amz-Expires=3600&X-Amz-Signature=3f36f8eb53217dcf9514da7e91308c25d7a3aeb2049f61c6ec27e54f76b3b66f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
  // const url2 =
  //   "https://asg-bot-cache.s3.us-east-2.amazonaws.com/ASG_MVP/LeaseCat/translation/6/translated/20260601_072618/sciencebook%20from%20wiki_translated_hin_translated_en.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUXFBSAJOPLVBKMUR%2F20260614%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260614T174524Z&X-Amz-Expires=3600&X-Amz-Signature=48ec2eb17f69d6ab5d35f82148c6cbf24a708a9554c89eec11d635a7dd22ac7d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 6.5rem)",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Upper Canvas Work Area */}
      <div
        style={{
          display: "flex",
          flexDirection: isNarrow ? "column" : "row",
          gap: "1rem",
          padding: isNarrow ? "0.5rem 0.75rem" : "0.5rem 1rem",
          flex: 1,
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        {/* Left PDF Column */}
        <div
          ref={containerRef1}
          onScroll={() => handleScroll(containerRef1, containerRef2)}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            minWidth: 0,
            width: isNarrow ? "100%" : undefined,
          }}
        >
          {isLoading1 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <Loader className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          )}
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => {
              setNumPages1(numPages);
              setIsLoading1(false);
            }}
            onLoadError={() => setIsLoading1(false)}
            loading
          >
            {Array.from(new Array(numPages1), (_el, index) => (
              <div
                key={`pdf1_page_${index + 1}`}
                style={{
                  marginBottom: "15px",
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }}
                // className="shadow-md"
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={baseWidth1 * scale}
                  onRenderSuccess={() => {
                    if (page1 !== index + 1) setPage1(index + 1);
                  }}
                />
              </div>
            ))}
          </Document>
        </div>

        {/* Right PDF Column */}
        <div
          ref={containerRef2}
          onScroll={() => handleScroll(containerRef2, containerRef1)}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            minWidth: 0,
            width: isNarrow ? "100%" : undefined,
          }}
        >
          {isLoading2 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <Loader className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          )}
          <Document
            file={url2}
            onLoadSuccess={({ numPages }) => {
              setNumPages2(numPages);
              setIsLoading2(false);
            }}
            onLoadError={() => setIsLoading2(false)}
            loading
          >
            {Array.from(new Array(numPages2), (_el, index) => (
              <div
                key={`pdf2_page_${index + 1}`}
                style={{
                  marginBottom: "15px",
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={baseWidth2 * scale}
                  onRenderSuccess={() => {
                    if (page2 !== index + 1) setPage2(index + 1);
                  }}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* Reconfigured Bottom Floating Menu Container centered horizontally */}
      <div
        className="shadow-sm"
        style={{
          position: "absolute",
          bottom: "0.65rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.45rem 1rem",
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          border: "1px solid #e0e0e0",
          gap: "14px",
          color: "#333333",
          zIndex: 100,
          userSelect: "none",
          maxWidth: "calc(100% - 2rem)",
        }}
      >
        {/* Navigation Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            onClick={() => {
              setPage1(1);
              setInputPage("1");
              scrollToPage(1);
            }}
            style={{
              cursor: "pointer",
              color: page1 === 1 ? "#d9d9d9" : "#8c8c8c",
              display: "flex",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
          </span>
          <span
            onClick={handlePrev}
            style={{
              cursor: "pointer",
              color: page1 === 1 ? "#d9d9d9" : "#333333",
              display: "flex",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>

          {/* Interactive Input Page Field */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
            }}
          >
            <input
              type="text"
              value={inputPage}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              style={{
                width: "35px",
                textAlign: "center",
                padding: "2px 4px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <span style={{ color: "#8c8c8c" }}>/ {numPages1 || "-"}</span>
          </div>

          <span
            onClick={handleNext}
            style={{
              cursor: "pointer",
              color: numPages1 && page1 >= numPages1 ? "#d9d9d9" : "#333333",
              display: "flex",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
          <span
            onClick={() => {
              if (numPages1) {
                setPage1(numPages1);
                setInputPage(numPages1.toString());
                scrollToPage(numPages1);
              }
            }}
            style={{
              cursor: "pointer",
              color: numPages1 && page1 >= numPages1 ? "#d9d9d9" : "#8c8c8c",
              display: "flex",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
          </span>
        </div>

        {/* Vertical Divider */}
        <div
          style={{ width: "1px", height: "16px", backgroundColor: "#e8e8e8" }}
        ></div>

        {/* Zoom Controls Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            onClick={zoomOut}
            style={{ cursor: "pointer", display: "flex", color: "#595959" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </span>

          <span
            style={{
              fontSize: "14px",
              minWidth: "40px",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {Math.round(scale * 100)}%
          </span>

          <span
            onClick={zoomIn}
            style={{ cursor: "pointer", display: "flex", color: "#595959" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </span>
        </div>

        {/* Vertical Divider */}
        <div
          style={{ width: "1px", height: "16px", backgroundColor: "#e8e8e8" }}
        ></div>

        {/* Sync Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "14px",
            color: "#595959",
          }}
        >
          <span>Scroll Sync</span>
          <Switch
            checked={isSyncScroll}
            onCheckedChange={setIsSyncScroll}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}
