import { useEffect, useRef, useState } from "react";

// ------------------------------------------------------------------
// PDF-as-HTML editor. Fully client-side — no backend required.
//
// Flow: convert your PDF to HTML with an online tool (pdf2htmlEX-style
// output works best), upload the .html here. It renders pixel-exact
// inside a sandboxed iframe; designMode makes the whole document
// contenteditable. Format with the toolbar, then download the edited
// HTML or print to PDF (browser print preserves the exact layout).
// ------------------------------------------------------------------

const COLORS = [
  "#111111",
  "#a32d2d",
  "#185fa5",
  "#0f6e56",
  "#854f0b",
  "#ffffff",
];
const HIGHLIGHTS = ["#fff176", "#a5f3c0", "#ffc4dd", "#b3dcff", "#ffd39b"];
const FONTS = [
  ["Arial", "Arial, Helvetica, sans-serif"],
  ["Helvetica", "Helvetica, Arial, sans-serif"],
  ["Times New Roman", "'Times New Roman', Times, serif"],
  ["Georgia", "Georgia, serif"],
  ["Garamond", "Garamond, 'Times New Roman', serif"],
  ["Verdana", "Verdana, Geneva, sans-serif"],
  ["Calibri", "Calibri, 'Segoe UI', sans-serif"],
  ["Courier New", "'Courier New', Courier, monospace"],
];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const SAMPLE_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Sample</title>
<style>
  body { margin: 0; background: #808080; font-family: sans-serif; }
  .pf { position: relative; width: 612px; height: 792px; margin: 13px auto;
        background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.35); overflow: hidden; }
  .t { position: absolute; white-space: pre; transform-origin: 0 0; }
</style></head>
<body>
<div class="pf">
  <div class="t" style="left:72px;top:70px;font-size:22px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;">COMMERCIAL LEASE AGREEMENT</div>
  <div class="t" style="left:72px;top:120px;font-size:14px;font-weight:bold;">1. Parties and premises</div>
  <div class="t" style="left:72px;top:145px;font-size:11.5px;font-family:Georgia,serif;">This lease is entered into between Riverside Holdings LLC, the Landlord, and</div>
  <div class="t" style="left:72px;top:162px;font-size:11.5px;font-family:Georgia,serif;">Meridian Retail Group, the Tenant, for the premises at 448 Commerce Street,</div>
  <div class="t" style="left:72px;top:179px;font-size:11.5px;font-family:Georgia,serif;">Suite 210, comprising approximately 4,150 rentable square feet.</div>
  <div class="t" style="left:72px;top:215px;font-size:14px;font-weight:bold;">2. Term and rent</div>
  <div class="t" style="left:72px;top:240px;font-size:11.5px;font-family:Georgia,serif;">The initial term is sixty (60) months. Base rent is $12,400 per month, payable</div>
  <div class="t" style="left:72px;top:257px;font-size:11.5px;font-family:Georgia,serif;">in advance on the first day of each calendar month without demand or offset.</div>
  <div class="t" style="left:72px;top:293px;font-size:14px;font-weight:bold;">3. Use and compliance</div>
  <div class="t" style="left:72px;top:318px;font-size:11.5px;font-family:Georgia,serif;">Tenant shall use the premises solely for general office and retail purposes and</div>
  <div class="t" style="left:72px;top:335px;font-size:11.5px;font-family:Georgia,serif;">for no other use without the Landlord's prior written consent.</div>
</div>
</body></html>`;

const CSS = `
  .hed * { box-sizing: border-box; }
  .hed { height: 100vh; display: flex; flex-direction: column;
    background: #e9ebee; font-family: -apple-system,'Segoe UI',Roboto,sans-serif;
    color: #1b2432; }
  .hed.embedded { height: 100%; min-height: 0; overflow: hidden; width: 100%; }

  .hed .topbar { display:flex; align-items:center; justify-content:space-between;
    padding:10px 20px; background:#fff; border-bottom:1px solid #d8dce3; flex-wrap:wrap; gap:8px; }
  .hed .docname { display:flex; align-items:baseline; gap:12px; font-weight:600; font-size:15px; min-width:0; }
  .hed .fname { max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .hed .state { font-size:12px; font-weight:400; color:#5b6474; white-space:nowrap; }
  .hed .state.dirty { color:#854f0b; }

  .hed .btn { padding:8px 16px; border-radius:8px; font-size:13.5px; font-weight:500;
    cursor:pointer; border:1px solid transparent; }
  .hed .btn.primary { background:#14532d; color:#fff; }
  .hed .btn.primary:hover { background:#166534; }
  .hed .btn.ghost { background:#fff; border-color:#c9cfd8; color:#1b2432; }
  .hed .btn.ghost:hover { border-color:#98a1af; }

  .hed .toolbar { display:flex; align-items:center; gap:4px; padding:6px 20px;
    background:#fff; border-bottom:1px solid #d8dce3; flex-wrap:wrap; }
  .hed .tbb { min-width:32px; height:30px; border:1px solid transparent; border-radius:6px;
    background:none; font-size:14px; cursor:pointer; color:#1b2432; }
  .hed .tbb:hover { background:#eef1f5; }
  .hed .tbdiv { width:1px; height:20px; background:#d8dce3; margin:0 8px; }
  .hed .tbsel { height:30px; border:1px solid #c9cfd8; border-radius:6px; background:#fff;
    font-size:13px; padding:0 6px; }
  .hed .swatch { width:20px; height:20px; border-radius:50%; border:2px solid #fff;
    outline:1px solid #c9cfd8; cursor:pointer; margin:0 2px; padding:0; }
  .hed .hlswatch { width:20px; height:20px; border-radius:4px; border:2px solid #fff;
    outline:1px solid #c9cfd8; cursor:pointer; margin:0 2px; padding:0;
    font-size:11px; line-height:1; color:#1b2432; }
  .hed .hint { margin-left:auto; font-size:12px; color:#5b6474; }

  .hed .frame-wrap { flex:1; min-height:0; }
  .hed.embedded .frame-wrap { overflow: hidden; }
  .hed iframe { width:100%; height:100%; border:none; display:block; background:#808080; }
  .hed.embedded iframe { overflow: hidden; }

  .hed .upwrap { flex:1; display:grid; place-items:center; padding:24px; }
  .hed .upcard { background:#fff; border:1px solid #d8dce3; border-radius:12px;
    padding:36px 36px 28px; max-width:520px; width:100%; text-align:center; }
  .hed .upcard h1 { margin:0 0 8px; font-size:22px; font-weight:600; }
  .hed .upcard p { margin:0 0 18px; color:#5b6474; font-size:14px; line-height:1.6; }
  .hed .steps { text-align:left; font-size:13px; color:#5b6474; background:#f6f8fa;
    border:1px solid #e3e7ec; border-radius:8px; padding:12px 16px 12px 32px; margin:0 0 22px; }
  .hed .steps li { margin:4px 0; }
  .hed .dropzone { display:flex; flex-direction:column; align-items:center; gap:6px;
    padding:32px 20px; border:2px dashed #b7c2b9; border-radius:10px; background:#f6f9f7;
    cursor:pointer; transition:border-color .15s, background .15s; }
  .hed .dropzone:hover, .hed .dropzone.over { border-color:#14532d; background:#eef5f0; }
  .hed .dz-title { font-size:15px; font-weight:600; color:#14532d; }
  .hed .dz-sub { font-size:12.5px; color:#5b6474; }
  .hed .uperror { color:#a32d2d; font-size:13px; margin:14px 0 0; }
  .hed .samplelink { margin-top:16px; background:none; border:none; color:#185fa5;
    font-size:13px; cursor:pointer; text-decoration:underline; }
`;

type HtmlPdfEditorProps = {
  initialHtml?: string | null;
  initialFileName?: string;
  embedded?: boolean;
};

export default function HtmlPdfEditor({
  initialHtml = null,
  initialFileName = "",
  embedded = false,
}: HtmlPdfEditorProps = {}) {
  const [fileName, setFileName] = useState(initialFileName);
  const [srcDoc, setSrcDoc] = useState(initialHtml);
  const [dirty, setDirty] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState("100");
  const iframeRef = useRef(null);

  function getDoc() {
    return iframeRef.current?.contentDocument || null;
  }

  async function handleFile(file) {
    if (!file) return;
    setError("");
    const name = file.name.toLowerCase();
    if (
      !name.endsWith(".html") &&
      !name.endsWith(".htm") &&
      !name.endsWith(".xhtml")
    ) {
      setError("Please upload an .html file (convert your PDF to HTML first).");
      return;
    }
    const text = await file.text();
    setFileName(file.name);
    setDirty(false);
    setSrcDoc(text);
  }

  function loadSample() {
    setFileName("commercial-lease.html");
    setDirty(false);
    setSrcDoc(SAMPLE_HTML);
  }

  function fitEmbeddedContent() {
    const doc = getDoc();
    const iframe = iframeRef.current;
    if (!doc || !iframe) return;

    const sidebar = doc.getElementById("sidebar");
    if (sidebar) sidebar.style.display = "none";

    const pageContainer = doc.getElementById("page-container");
    if (pageContainer) {
      pageContainer.style.position = "relative";
      pageContainer.style.left = "0";
      pageContainer.style.right = "auto";
      pageContainer.style.overflowX = "hidden";
    }

    doc.documentElement.style.overflowX = "hidden";
    doc.body.style.overflowX = "hidden";
    doc.body.style.margin = "0";

    const firstPage = doc.querySelector(".pf") as HTMLElement | null;
    if (!firstPage) return;

    const pageWidth = firstPage.offsetWidth || firstPage.scrollWidth || 918;
    const availWidth = Math.max(iframe.clientWidth - 16, 120);
    const pct = Math.min(100, Math.floor((availWidth / pageWidth) * 100));
    const zoomValue = String(pct);

    setZoom(zoomValue);
    doc.body.style.zoom = zoomValue + "%";
  }

  function onFrameLoad() {
    const doc = getDoc();
    if (!doc) return;
    // Make the entire converted document editable in place.
    doc.designMode = "on";
    doc.body.setAttribute("contenteditable", "true");
    doc.body.setAttribute("spellcheck", "false");
    doc.addEventListener("input", () => setDirty(true));

    if (embedded) {
      fitEmbeddedContent();
      return;
    }

    doc.body.style.zoom = zoom + "%";
  }

  useEffect(() => {
    if (!embedded || !srcDoc) return;

    const iframe = iframeRef.current;
    const wrap = iframe?.parentElement;
    if (!wrap) return;

    const observer = new ResizeObserver(() => fitEmbeddedContent());
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [embedded, srcDoc]);

  function exec(cmd, val) {
    const doc = getDoc();
    if (!doc) return;
    doc.execCommand(cmd, false, val);
    setDirty(true);
  }

  function highlight(color) {
    const doc = getDoc();
    if (!doc) return;
    // hiliteColor sets background on the selection only (Chrome/Firefox);
    // backColor is the fallback name used by some engines.
    if (!doc.execCommand("hiliteColor", false, color)) {
      doc.execCommand("backColor", false, color);
    }
    setDirty(true);
  }

  function setFontSize(px) {
    const doc = getDoc();
    if (!doc) return;
    // execCommand("fontSize") only accepts levels 1-7. Apply level 7 as a
    // marker, then convert every <font size="7"> it created into an exact
    // pixel size — the standard way to get real numeric sizing.
    doc.execCommand("fontSize", false, "7");
    doc.querySelectorAll('font[size="7"]').forEach((f) => {
      f.removeAttribute("size");
      f.style.fontSize = px + "px";
    });
    setDirty(true);
  }

  function setFontFamily(family) {
    const doc = getDoc();
    if (!doc) return;
    doc.execCommand("fontName", false, family);
    setDirty(true);
  }

  function applyZoom(v) {
    setZoom(v);
    const doc = getDoc();
    if (doc) doc.body.style.zoom = v + "%";
  }

  function downloadHtml() {
    const doc = getDoc();
    if (!doc) return;
    // Strip editing attributes before saving, restore after serializing.
    doc.body.removeAttribute("contenteditable");
    const savedZoom = doc.body.style.zoom;
    doc.body.style.zoom = "";
    const html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
    doc.body.setAttribute("contenteditable", "true");
    doc.body.style.zoom = savedZoom;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.x?html?$/i, "") + "-edited.html";
    a.click();
    URL.revokeObjectURL(url);
    setDirty(false);
  }

  function printToPdf() {
    const win = iframeRef.current?.contentWindow;
    const doc = getDoc();
    if (!win || !doc) return;
    const savedZoom = doc.body.style.zoom;
    doc.body.style.zoom = ""; // print at true size
    win.focus();
    win.print(); // user chooses "Save as PDF" — exact layout preserved
    doc.body.style.zoom = savedZoom;
  }

  const rootClass = embedded ? "hed embedded" : "hed";

  if (!srcDoc) {
    return (
      <div className={rootClass}>
        <style>{CSS}</style>
        <div className="upwrap">
          <div className="upcard">
            <h1>PDF-as-HTML editor</h1>
            <p>
              Edit your PDF with its exact original layout, right in the
              browser.
            </p>
            <ol className="steps">
              <li>
                Convert your PDF to HTML with an online tool (pdf2htmlEX-style
                output keeps the exact layout).
              </li>
              <li>
                Upload the .html file below — it renders exactly like the PDF.
              </li>
              <li>Click anywhere and type. Use the toolbar for formatting.</li>
              <li>
                Download the edited HTML, or print to PDF to get a PDF back.
              </li>
            </ol>
            <label
              className={"dropzone" + (dragOver ? " over" : "")}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                accept=".html,.htm,.xhtml,text/html"
                hidden
                onChange={(e) => {
                  handleFile(e.target.files[0]);
                  e.target.value = "";
                }}
              />
              <span className="dz-title">Drop your converted .html here</span>
              <span className="dz-sub">or click to browse</span>
            </label>
            {error && <p className="uperror">{error}</p>}
            <button className="samplelink" onClick={loadSample}>
              No file handy? Open a sample converted lease
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={rootClass}
      style={{
        border: "1px solid rgba(60, 64, 67, 0.2)",
      }}
    >
      <style>{CSS}</style>

      {!embedded && (
        <header className="topbar">
          <div className="docname">
            <span className="fname" title={fileName}>
              {fileName}
            </span>
            <span className={"state" + (dirty ? " dirty" : "")}>
              {dirty ? "Unsaved changes" : "No changes yet"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn ghost"
              onClick={() => {
                setSrcDoc(null);
                setFileName("");
              }}
            >
              New file
            </button>
            <button className="btn ghost" onClick={downloadHtml}>
              Download HTML
            </button>
            <button className="btn primary" onClick={printToPdf}>
              Print to PDF
            </button>
          </div>
        </header>
      )}

      <div className="toolbar">
        <button
          className="tbb"
          title="Bold"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
        >
          <b>B</b>
        </button>
        <button
          className="tbb"
          title="Italic"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
        >
          <i>I</i>
        </button>
        <button
          className="tbb"
          title="Underline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("underline")}
        >
          <u>U</u>
        </button>
        <button
          className="tbb"
          title="Strikethrough"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("strikeThrough")}
        >
          <s>S</s>
        </button>
        <span className="tbdiv" />
        <select
          className="tbsel"
          title="Font family"
          defaultValue=""
          style={{ maxWidth: 150 }}
          onChange={(e) => {
            if (e.target.value) setFontFamily(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Font
          </option>
          {FONTS.map(([label, stack]) => (
            <option key={label} value={stack}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="tbsel"
          title="Font size (px)"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) setFontSize(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Size
          </option>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="tbdiv" />
        {COLORS.map((c) => (
          <button
            key={c}
            className="swatch"
            title={"Text color " + c}
            style={{
              background: c,
              outline: c === "#ffffff" ? "1px solid #98a1af" : undefined,
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("foreColor", c)}
          />
        ))}
        <span className="tbdiv" />
        {HIGHLIGHTS.map((c) => (
          <button
            key={c}
            className="hlswatch"
            title={"Highlight " + c}
            style={{ background: c }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => highlight(c)}
          />
        ))}
        <button
          className="hlswatch"
          title="Remove highlight"
          style={{ background: "#fff" }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => highlight("transparent")}
        >
          ×
        </button>
        <span className="tbdiv" />
        <button
          className="tbb"
          title="Undo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("undo")}
        >
          ↶
        </button>
        <button
          className="tbb"
          title="Redo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("redo")}
        >
          ↷
        </button>
        <span className="tbdiv" />
        <select
          className="tbsel"
          title="Zoom"
          value={zoom}
          onChange={(e) => applyZoom(e.target.value)}
        >
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
        </select>
        <span className="hint">Click anywhere in the page and type</span>
      </div>

      <div className="frame-wrap">
        <iframe
          ref={iframeRef}
          title="document"
          sandbox="allow-same-origin allow-scripts allow-modals"
          srcDoc={srcDoc}
          onLoad={onFrameLoad}
        />
      </div>
    </div>
  );
}
