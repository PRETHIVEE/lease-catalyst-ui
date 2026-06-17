/* eslint-disable @typescript-eslint/no-explicit-any */
import TranslationsAPI from "@/api/translation";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fileDownloader,
  fileDownloader2,
  getPresignedUrl,
} from "@/utils/utils";
import { ChevronDownIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeasePdfViewer from "../components/LeasePdfViewer";

const TranslationReview = () => {
  const [searchParams] = useSearchParams();
  const JobId = searchParams.get("id") || "";
  const [data, setData] = useState<any>(null);
  const [SourceFileUrl, setSourceFileUrl] = useState<string>("");
  const [TranslatedFileUrl, setTranslatedFileUrl] = useState<string>("");

  const BreadcrumbsData = [
    { label: "Lease Translation", url: "/lease-translate" },
    { label: data?.file_name || "...", url: "/lease-translate" },
  ];

  const getTranslationDetails = () => {
    TranslationsAPI.getTranslationStatus(JobId)
      .then((response) => {
        const responseData = response?.data;
        setData(responseData);
        getPresignedUrl(responseData?.source_file).then((url) =>
          setSourceFileUrl(url),
        );
        getPresignedUrl(responseData?.translated_file).then((url) =>
          setTranslatedFileUrl(url),
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (JobId) {
      getTranslationDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JobId]);

  const handleDownlaodAsWord = () => {
    TranslationsAPI.DownloadWord(JobId).then((response) => {
      if (response.status === 200) {
        getPresignedUrl(response?.data?.docx_file).then((url) =>
          fileDownloader(url),
        );
      }
    });
  };

  return (
    <div className="pt-4 px-4">
      <div className="flex justify-between align-center">
        <BreadCrumbs items={BreadcrumbsData} />
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() =>
              fileDownloader2(
                TranslatedFileUrl,
                `translated_${data?.output_lang}_${data?.file_name}`,
              )
            }
          >
            Download
          </Button>
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
                <DropdownMenuItem
                  onSelect={() =>
                    fileDownloader2(SourceFileUrl, `source_${data?.file_name}`)
                  }
                >
                  <Download />
                  Download Source File
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() =>
                    fileDownloader2(
                      TranslatedFileUrl,
                      `translated_${data?.output_lang}_${data?.file_name}`,
                    )
                  }
                >
                  <Download />
                  Download Translated File
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={handleDownlaodAsWord}>
                  <Download />
                  Download as Word
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <div className="mt-1">
        {SourceFileUrl?.length > 0 && (
          <LeasePdfViewer url={SourceFileUrl} url2={TranslatedFileUrl} />
        )}
      </div>
    </div>
  );
};

export default TranslationReview;