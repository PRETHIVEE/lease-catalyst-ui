import { Loader } from "lucide-react";
import PdfViewer from "../PdfView/PdfViewer";

const DocumentsSection = ({
  activeTab,
  auditId,
}: {
  activeTab: string;
  auditId: string;
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
      style={{ backgroundColor: "#636363" }}
    >
      {showDocument ? (
        <>
          <div style={{ width: "94%", margin: "0 auto" }}>
            {documentURL ? (
              <PdfViewer url={documentURL} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <Loader className="size-4 animate-spin" />
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
