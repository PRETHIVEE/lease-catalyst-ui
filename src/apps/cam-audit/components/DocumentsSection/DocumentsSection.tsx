import PdfViewer from "@/components/common/PdfViewer";
import { Loader } from "lucide-react";

const DocumentsSection = () => {
  const scopeDocumentUrl =
    "https://asg-bot-cache.s3.us-east-2.amazonaws.com/ASG_MVP/LeaseCat/uploads/scope_documents/20260701_054718_Contrato%20Arrendamiento_Ashurst_vf_executive%20version%20y%20anexos_27022026_signed_signed%20en-GB%20-%20Copy%20%281%29.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUXFBSAJOPLVBKMUR%2F20260703%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260703T035747Z&X-Amz-Expires=3600&X-Amz-Signature=009ed9912b27bcfbe1565516aadb0af716251c98fc0ffa49c42e3237bee6d094&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
  return (
    <div
      className="h-[50vh] overflow-y-auto"
      style={{ backgroundColor: "#9c9c9c" }}
    >
      <div style={{ width: "94%", margin: "0 auto" }}>
        {scopeDocumentUrl ? (
          <PdfViewer url={scopeDocumentUrl} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <Loader className="size-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;
