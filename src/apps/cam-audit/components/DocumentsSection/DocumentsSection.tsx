import { Loader } from "lucide-react";
import PdfViewer, { type PdfHighlight } from "../PdfView/PdfViewer";

const DocumentsSection = ({
  activeTab,
  auditId,
  highlight,
}: {
  activeTab: string;
  auditId: string;
  highlight?: PdfHighlight | null;
}) => {
  const showDocument =
    activeTab === "lease-document" || activeTab === "cam-statement"
      ? true
      : false;

  const leaseDocumentUrl = `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/documents/lease`;
  const camStatementDocumentUrl = `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/documents/cam`;

  const documentURL =
    activeTab === "lease-document"
      ? leaseDocumentUrl
      : activeTab === "cam-statement"
        ? camStatementDocumentUrl
        : "";

  return (
    <div
      className="h-[50vh] overflow-y-auto"
      style={{ backgroundColor: "#636363", color: "#fff" }}
    >
      {showDocument ? (
        <>
          <div className="h-full" style={{ width: "100%", margin: "0 auto" }}>
            {documentURL ? (
              <PdfViewer
                url={documentURL}
                highlight={highlight}
                className="h-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <Loader className="size-8 animate-spin text-white" />
                <p className="text-sm text-white">Loading document...</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#fff",
            marginTop: "4rem",
            fontStyle: "italic",
          }}
        >
          No <span style={{ textTransform: "capitalize" }}>{activeTab}</span>{" "}
          document found for this audit
        </p>
      )}
    </div>
  );
};

export default DocumentsSection;
