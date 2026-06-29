import { cn } from "@/lib/utils";
import { getFileExtension } from "@/utils/utils";
import { ArrowUp, File, Trash2 } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const FILE_ICON_BY_EXTENSION: Record<string, string> = {
  xls: "/util-images/xls.png",
  xlsx: "/util-images/xls.png",
  pdf: "/util-images/pdf.png",
};

const getFileIconSrc = (extension: string): string =>
  FILE_ICON_BY_EXTENSION[extension] ?? "/util-images/xls.png";

export interface UploadAreaProps {
  uploadDocuments: File[];
  setUploadDocuments: Dispatch<SetStateAction<File[]>>;
  supportedFormats: string[];
  maxFiles?: number;
}

const normalizeExtensions = (formats: string[]): string[] =>
  formats.map((format) => format.replace(/^\./, "").toLowerCase());

const buildAcceptAttribute = (formats: string[]): string => {
  const extensions = normalizeExtensions(formats);
  const mimeTypes = extensions
    .map((extension) => MIME_TYPES_BY_EXTENSION[extension])
    .filter(Boolean);
  const dottedExtensions = extensions.map((extension) => `.${extension}`);
  return [...dottedExtensions, ...mimeTypes].join(",");
};

const formatSupportedFormatsLabel = (formats: string[]): string =>
  normalizeExtensions(formats)
    .map((extension) => extension)
    .join(", ");

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const size = bytes / 1024 ** unitIndex;
  const formatted =
    size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
};

const isValidFile = (file: File, supportedFormats: string[]): boolean => {
  const extension = getFileExtension(file.name);
  if (!normalizeExtensions(supportedFormats).includes(extension)) return false;
  if (file.size > MAX_FILE_SIZE_BYTES) return false;
  return true;
};

const mergeFiles = (
  current: File[],
  incoming: File[],
  supportedFormats: string[],
  maxFiles?: number
): File[] => {
  const next = [...current];
  for (const file of incoming) {
    if (maxFiles !== undefined && next.length >= maxFiles) break;
    if (!isValidFile(file, supportedFormats)) continue;
    const isDuplicate = next.some(
      (existing) =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified
    );
    if (!isDuplicate) next.push(file);
  }
  return next;
};

interface UploadedFileRowProps {
  file: File;
  onRemove: () => void;
}

const UploadedFileRow = ({ file, onRemove }: UploadedFileRowProps) => {
  const extension = getFileExtension(file.name);

  return (
    <div className="flex items-center gap-3 rounded-sm bg-[#f3f4f6] px-3 py-2.5">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white shadow-sm"
        aria-hidden
      >
        <img
          src={getFileIconSrc(extension)}
          alt=""
          className="size-5 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.78rem]  text-[#374151]">{file.name}</p>
        <p className="text-[0.75rem] text-[#9ca3af]">
          {formatFileSize(file.size)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="cursor-pointer shrink-0 rounded-sm p-1 text-[#6b7280] transition-colors hover:bg-white hover:text-[#374151]"
        aria-label={`Remove ${file.name}`}
      >
        <Trash2 className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
};

const UploadArea = ({
  uploadDocuments,
  setUploadDocuments,
  supportedFormats,
  maxFiles,
}: UploadAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const acceptAttribute = buildAcceptAttribute(supportedFormats);
  const supportedFormatsLabel = formatSupportedFormatsLabel(supportedFormats);
  const isUploadDisabled =
    maxFiles !== undefined && uploadDocuments.length >= maxFiles;

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      if (isUploadDisabled) return;
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;
      setUploadDocuments((current) =>
        mergeFiles(current, fileArray, supportedFormats, maxFiles)
      );
    },
    [isUploadDisabled, maxFiles, setUploadDocuments, supportedFormats]
  );

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    if (isUploadDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (isUploadDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    if (isUploadDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleInputChange = () => {
    if (inputRef.current?.files?.length) {
      addFiles(inputRef.current.files);
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    setUploadDocuments((current) => current.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={isUploadDisabled}
        className={cn(
          "flex flex-col items-center justify-center rounded-sm border border-dashed px-6 py-4 transition-colors",
          isUploadDisabled
            ? "cursor-not-allowed border-[#d1d5db] bg-[#f9fafb] opacity-60"
            : "cursor-pointer border-[#3b82f6] bg-[#f0f7ff]",
          !isUploadDisabled && isDragging && "border-[#2563eb] bg-[#dbeafe]"
        )}
      >
        <div className="relative mb-4" aria-hidden>
          <File
            className="size-10 text-[#cbd5e1]"
            strokeWidth={1.25}
            fill="#e2e8f0"
          />
          <span className="absolute -bottom-0.5 -right-1 flex size-5 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm">
            <ArrowUp className="size-4" strokeWidth={2.25} />
          </span>
        </div>

        <p className="pointer-events-none text-center text-[0.78rem] text-[#374151]">
          Drag and Drop file here or{" "}
          <span className="pointer-events-auto font-medium text-[#2563eb] underline underline-offset-2">
            Choose file
          </span>
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles === undefined || maxFiles > 1}
          accept={acceptAttribute}
          className="sr-only"
          disabled={isUploadDisabled}
          onChange={handleInputChange}
        />
      </label>

      <div className="mt-2 flex items-center justify-between text-[0.74rem] text-[#374151]">
        <span>Allowed formats: {supportedFormatsLabel}</span>
        <span>Max. size: 50MB</span>
      </div>

      {uploadDocuments.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {uploadDocuments.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`}>
              <UploadedFileRow
                file={file}
                onRemove={() => handleRemove(index)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadArea;
