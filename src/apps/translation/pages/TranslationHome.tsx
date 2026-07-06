/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TranslationsAPI from "@/api/translation";
import StatusChip from "@/components/common/StatusChip";
import UploadArea from "@/components/common/UploadArea";
import { Button } from "@/components/ui/button";
import { useSnackbarStore } from "@/store/snackbar-store";

import {
  fileDownloader2,
  formatDateTime,
  getPresignedUrl,
} from "@/utils/utils";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Download,
  FileSearch,
  Grid2X2,
  Languages,
  LanguagesIcon,
  Loader,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  autoDetectLang,
  defaultTargetLang,
  languageOptions,
} from "../components/languages";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconButton, Tooltip } from "@mui/material";
import { useLayoutStore } from "@/layout/main-layout/store/layoutStore";

type LanguageOption = {
  language: string;
  language_code: string;
};

const sourceLanguageOptions: LanguageOption[] = [
  autoDetectLang,
  ...languageOptions,
];

const formatLanguageLabel = (option: LanguageOption) =>
  option.language_code
    ? `${option.language} (${option.language_code})`
    : option.language;

const isSameLanguage = (a: LanguageOption, b: LanguageOption) =>
  a.language === b.language && a.language_code === b.language_code;

const TranslationHome = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);
  const user_id = localStorage.getItem("user_id") || "";
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const currentActiveTab =
    sessionStorage.getItem("Translate-activeTab") || "new-translation";
  const [activeTab, setActiveTab] = useState(currentActiveTab);

  const [sourceLanguage, setSourceLanguage] =
    useState<LanguageOption>(autoDetectLang);
  const [targetLanguage, setTargetLanguage] =
    useState<LanguageOption>(defaultTargetLang);

  const Columns: GridColDef[] = [
    // { field: "file_id", headerName: "File ID", width: 88 },
    {
      field: "file_name",
      headerName: "File Name",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Link
            className="column-cell-link"
            to={`/lease-translate/review?id=${params.row.file_id}`}
            onClick={() => {
              closeSidebar();
              navigate(`/lease-translate/review?id=${params.row.file_id}`);
            }}
          >
            {params?.row?.file_name}
          </Link>
        );
      },
    },
    {
      field: "input_lang",
      headerName: "Source Language",
      width: 165,
    },
    {
      field: "output_lang",
      headerName: "Target Language",
      width: 165,
    },

    {
      field: "translate_status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const { translate_status } = params.row;
        const variant =
          translate_status === "completed"
            ? "success"
            : translate_status === "pending"
              ? "pending"
              : "failed";
        return <StatusChip label={translate_status} variant={variant} />;
      },
    },

    {
      field: "job_created_at",
      headerName: "Created On",
      width: 165,
      valueFormatter: (value) => formatDateTime(value),
    },

    {
      field: "action",
      headerName: "Actions",
      minWidth: 140,
      renderCell: (params: GridRenderCellParams) => {
        const { translate_status } = params.row;

        return (
          <span>
            <Tooltip title={"Review translation"} arrow placement="bottom">
              <IconButton
                size="small"
                onClick={() => {
                  closeSidebar();
                  navigate(`/lease-translate/review?id=${params.row.file_id}`);
                }}
                disabled={translate_status !== "completed"}
              >
                <FileSearch className="size-4" aria-hidden />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={"Download"}
              arrow
              placement="bottom"
              sx={{ marginInline: 0.75 }}
            >
              <IconButton
                size="small"
                disabled={translate_status !== "completed"}
                onClick={() =>
                  handleDownload(
                    params.row.translated_file,
                    params.row.file_name,
                    params.row.output_lang,
                  )
                }
              >
                <Download className="size-4" aria-hidden />
              </IconButton>
            </Tooltip>

            <Tooltip title={"Delete"} arrow placement="bottom">
              <IconButton
                disabled={translate_status !== "completed"}
                size="small"
                onClick={() => deleteTranslation(params.row.file_id)}
              >
                <Trash2 className="size-4" aria-hidden />
              </IconButton>
            </Tooltip>
          </span>
        );
      },
    },
  ];

  const deleteTranslation = (file_id: number) => {
    setLoading(true);

    TranslationsAPI.deleteTranslation(file_id.toString())
      .then(() => {
        showSnackbar("Translation deleted", "success");
        getTranslationHistory();
      })
      .catch(() => {
        showSnackbar(
          "Failed to delete translation. Please try again.",
          "error",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownload = (
    filePath: string,
    fileName: string,
    targetLanguage: string,
  ) => {
    getPresignedUrl(filePath).then((url) => {
      fileDownloader2(url, `translated_${targetLanguage}_${fileName}`);
    });
  };

  // Fetch translation history
  const getTranslationHistory = () => {
    TranslationsAPI.getTranslationHistory(user_id)
      .then((res) => {
        const data =
          res.data?.translations.map((i: any, index: number) => {
            return { ...i, id: index };
          }) || [];
        setRows(data);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTranslationHistory();
    const intervalId = setInterval(getTranslationHistory, 6000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartTranslate = (): void => {
    if (uploadDocuments.length === 0) {
      showSnackbar("Please select a file to translate.", "error");
      return;
    }

    setIsTranslating(true);
    const formData = new FormData();
    formData.append("file", uploadDocuments[0]);
    formData.append("user_id", user_id);
    formData.append("input_lang", sourceLanguage.language);
    formData.append("input_lang_code", sourceLanguage.language_code);
    formData.append("output_lang", targetLanguage.language);
    formData.append("output_lang_code", targetLanguage.language_code);

    TranslationsAPI.UploadTranslate(formData)
      .then((response) => {
        if (response.status === 200) {
          getTranslationHistory();
          setUploadDocuments([]);
          showSnackbar("Translation started!");
          getTranslationHistory();
          setActiveTab("history");
        }
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.detail
          .map((i: { msg: string }) => i.msg)
          .join(", ");
        showSnackbar(
          errorMessage || "Error uploading file. Please retry",
          "error",
        );
      })
      .finally(() => {
        setIsTranslating(false);
      });
  };

  return (
    <div className="p-4">
      <h5 className="text-[0.98rem]  font-semibold text-font-color-primary">
        Lease Translation
      </h5>

      <div className="mt-1.5">
        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setActiveTab(tab);
            sessionStorage.setItem("Translate-activeTab", tab);
          }}
          className="gap-0"
        >
          <TabsList>
            <TabsTrigger value="new-translation">
              <LanguagesIcon aria-hidden />
              New Translation
            </TabsTrigger>
            <TabsTrigger value="history">
              <Grid2X2 aria-hidden />
              Translation History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "new-translation" && (
        <div className="mt-12 max-w-2xl rounded-sm border border-slate-200 bg-[#fafafa] p-4 m-auto">
          <div className="mb-3">
            <UploadArea
              uploadDocuments={uploadDocuments}
              setUploadDocuments={setUploadDocuments}
              supportedFormats={["pdf"]}
            />
          </div>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            className="mt-5.5 form-container"
          >
            <Autocomplete
              fullWidth
              disablePortal
              options={sourceLanguageOptions}
              value={sourceLanguage}
              onChange={(_event, value) => {
                if (value) setSourceLanguage(value);
              }}
              getOptionLabel={formatLanguageLabel}
              isOptionEqualToValue={isSameLanguage}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Source Language (Searchable)"
                />
              )}
            />
            <Autocomplete
              fullWidth
              disablePortal
              options={languageOptions}
              value={targetLanguage}
              onChange={(_event, value) => {
                if (value) setTargetLanguage(value);
              }}
              getOptionLabel={formatLanguageLabel}
              isOptionEqualToValue={isSameLanguage}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Target Language (Searchable)"
                />
              )}
            />
          </Stack>

          <Button
            type="button"
            variant="primary"
            className="mt-4 h-9 w-full text-[0.82rem] font-semibold uppercase"
            disabled={isTranslating || uploadDocuments.length === 0}
            onClick={handleStartTranslate}
          >
            {isTranslating ? (
              <>
                <Loader className="animate-spin" />
                Translating..
              </>
            ) : (
              <>
                <Languages aria-hidden />
                Start Translate
              </>
            )}
          </Button>
        </div>
      )}

      {activeTab === "history" && (
        <Box
          sx={{ height: "77vh", width: "100%" }}
          className="app-datagrid-container mt-2"
        >
          <DataGrid
            density="compact"
            rows={Rows}
            columns={Columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            showToolbar
            sx={{}}
          />
        </Box>
      )}
    </div>
  );
};

export default TranslationHome;
