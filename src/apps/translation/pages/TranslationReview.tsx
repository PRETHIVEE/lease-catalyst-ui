import TranslationsAPI from "@/api/translation";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import PDFViewer from "@/components/common/PDFViewer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fileDownloader, getPresignedUrl } from "@/utils/utils";
import { ChevronDownIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TranslationReview = () => {
  const [searchParams] = useSearchParams();
  const JobId = searchParams.get("id") || "";
  const [data, setData] = useState<any>(null);
  const [SourceFileUrl, setSourceFileUrl] = useState<string>("");
  const [TranslatedFileUrl, setTranslatedFileUrl] = useState<string>("");

  const BreadcrumbsData = [
    { label: "Home", url: "/dashboard" },
    { label: "Lease Translation", url: "/lease-translate" },
    { label: data?.file_name || "...", url: "/lease-translate" },
  ];

  const getTranslationDetails = () => {
    TranslationsAPI.getTranslationStatus(JobId)
      .then((response) => {
        const responseData = response?.data;
        setData(responseData);
        getPresignedUrl(responseData?.source_file).then((url) =>
          setSourceFileUrl(url)
        );
        getPresignedUrl(responseData?.translated_file).then((url) =>
          setTranslatedFileUrl(url)
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (JobId) {
      getTranslationDetails();
    }
  }, [JobId]);

  const handleDownlaodAsWord = () => {
    TranslationsAPI.DownloadWord(JobId).then((response) => {
      if (response.status === 200) {
        getPresignedUrl(response?.data?.docx_file).then((url) =>
          fileDownloader(url)
        );
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between align-center">
        <BreadCrumbs items={BreadcrumbsData} />
        <ButtonGroup>
          <Button variant="primary">Download</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" className="pl-2!">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={handleDownlaodAsWord}>
                  <Download />
                  Download as Word
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  onSelect={() => fileDownloader(SourceFileUrl)}
                >
                  <Download />
                  Download Source file
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download />
                  Download Translated file
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <div className="mt-2 grid flex-1 grid-cols-2 gap-18">
        <PDFViewer url={SourceFileUrl} title="Source PDF" />
        <PDFViewer url={TranslatedFileUrl} title="Translated PDF" />
      </div>
    </div>
  );
};

export default TranslationReview;
