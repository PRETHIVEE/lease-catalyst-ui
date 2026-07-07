import { useEffect, useState } from "react";
import PdfViewer from "@/components/common/PdfViewer";
import HtmlPdfEditor from "./components/htmleditor/htmleditor";
import "./LeaseTranslatorBeta.scss";

const SOURCE_PDF = "/temp/source_PASAR_BSC COL Bogota 3PL Annex3.pdf";
const TRANSLATED_HTML =
  "/temp/translated_English_source_PASAR_BSC COL Bogota 3PL Annex 3 2025 Rates 2.html";
const TRANSLATED_HTML_NAME =
  "translated_English_source_PASAR_BSC COL Bogota 3PL Annex 3 2025 Rates 2.html";

const LeaseTranslatorBeta = () => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [htmlLoading, setHtmlLoading] = useState(true);

  useEffect(() => {
    fetch(encodeURI(TRANSLATED_HTML))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load HTML");
        return res.text();
      })
      .then((text) => setHtmlContent(text))
      .catch(() => setHtmlContent(null))
      .finally(() => setHtmlLoading(false));
  }, []);

  return (
    <div className="lease-translator-beta" style={{ padding: "14px" }}>
      <div className="lease-translator-beta__pane lease-translator-beta__pane--pdf">
        <PdfViewer
          url={encodeURI(SOURCE_PDF)}
          className="lease-translator-beta__viewer"
        />
      </div>
      <div className="lease-translator-beta__pane lease-translator-beta__pane--html">
        {htmlLoading ? (
          <div className="lease-translator-beta__loading">
            Loading translation...
          </div>
        ) : (
          <HtmlPdfEditor
            embedded
            initialHtml={htmlContent}
            initialFileName={TRANSLATED_HTML_NAME}
          />
        )}
      </div>
    </div>
  );
};

export default LeaseTranslatorBeta;
