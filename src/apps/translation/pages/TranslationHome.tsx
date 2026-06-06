import TranslationsAPI from "@/api/translation";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import IconButton from "@/components/common/IconButton";
import StatusChip from "@/components/common/StatusChip";
import UploadArea from "@/components/common/UploadArea";
import { Button } from "@/components/ui/button";
import { useSnackbarStore } from "@/store/snackbar-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/utils/utils";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Download, Ellipsis, Eye, Languages, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  autoDetectLang,
  defaultTargetLang,
  languageOptions,
} from "../components/languages";
import { useNavigate } from "react-router-dom";

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

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Lease Translation", url: "/" },
];

const TranslationHome = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const user_id = localStorage.getItem("user_id") || "";
  const user_email = localStorage.getItem("user_email") || "";
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const [sourceLanguage, setSourceLanguage] =
    useState<LanguageOption>(autoDetectLang);
  const [targetLanguage, setTargetLanguage] =
    useState<LanguageOption>(defaultTargetLang);

  const Columns: GridColDef[] = [
    { field: "file_id", headerName: "File ID", width: 88 },
    {
      field: "file_name",
      headerName: "File Name",
      width: 220,
    },
    {
      field: "input_lang",
      headerName: "Source Language",
      width: 170,
    },
    {
      field: "output_lang",
      headerName: "Target Language",
      width: 170,
    },

    {
      field: "translate_status",
      headerName: "Status",
      width: 140,
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
      width: 174,
      valueFormatter: (value) => formatDateTime(value),
    },

    {
      field: "action",
      headerName: "Actions",
      minWidth: 100,
      // flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const { translate_status } = params.row;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              disabled={translate_status !== "completed"}
            >
              <IconButton
                disabled={translate_status !== "completed"}
                aria-label={`action options`}
                className="ml-2"
              >
                <Ellipsis className="size-4" aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuItem
                onSelect={() => {
                  navigate(`/lease-translate/review?id=${params.row.file_id}`);
                }}
              >
                <Eye aria-hidden className="mr-1.5" />
                Review translation
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => {}}>
                <Download aria-hidden className="mr-1.5" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Fetch translation history
  const getTranslationHistory = () => {
    setLoading(true);
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
    formData.append("user_name", user_email);
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
        }
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.detail
          .map((i: { msg: string }) => i.msg)
          .join(", ");
        showSnackbar(
          errorMessage || "Error uploading file. Please retry",
          "error"
        );
      })
      .finally(() => {
        setIsTranslating(false);
      });
  };

  return (
    <div className="p-4">
      <BreadCrumbs items={BreadcrumbsData} />
      <h5 className="text-[0.98rem] mt-2 font-semibold text-font-color-primary">
        Lease Translation
      </h5>

      <div className="my-4 max-w-3xl rounded-lg border border-slate-200 bg-[#fafafa] p-4">
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

      <Box
        sx={{ height: "80vh", width: "100%" }}
        className="app-datagrid-container mt-2"
      >
        {/* <DataGridTitle title="Translations Overview" /> */}
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
    </div>
  );
};

export default TranslationHome;
