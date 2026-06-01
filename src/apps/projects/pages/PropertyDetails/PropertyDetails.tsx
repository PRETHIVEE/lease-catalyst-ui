/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Building2,
  CloudUpload,
  Download,
  Ellipsis,
  Eye,
  FolderOpen,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProjectsAPI from "@/api/projects";
import { Link, useSearchParams } from "react-router-dom";
import { formatDateTime, getFileExtension } from "@/utils/utils";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "@/components/common/IconButton";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import UploadFiles from "../../components/UploadFiles/UploadFiles";
import { useSnackbarStore } from "@/store/snackbar-store";

const PropertyDetails = () => {
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const { projectId, propertyId } = Object.fromEntries(searchParams as any);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("property");
  const [documents, setDocumnets] = useState<any[]>([]);
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const BreadcrumbsData = [
    { label: "Home", url: "/dashboard" },
    { label: "Projects", url: "/projects" },
    {
      label: `Projects (${projectDetails?.project_name || "..."})`,
      url: `/projects/project-details?id=${projectId}`,
    },
    {
      label: `Property (${propertyDetails?.property_name || "..."})`,
      url: `/`,
    },
  ];

  const getPropertyInfo = () => {
    ProjectsAPI.getProjectById(Number(projectId))
      .then((response) => {
        setProjectDetails(response?.data);
      })
      .catch(() => {
        // Handle error
      });

    ProjectsAPI.getPropertyById(Number(propertyId))
      .then((response) => {
        console.log;
        setPropertyDetails(response?.data);
      })
      .catch(() => {
        // Handle error
      });

    fetchPropertyFiles();
  };

  const fetchPropertyFiles = () => {
    setIsDocumentLoading(true);
    ProjectsAPI.getPropertyFiles(Number(propertyId))
      .then((response) => {
        setDocumnets(response?.data?.files || []);
      })
      .catch(() => {
        // Handle error
      })
      .finally(() => {
        setIsDocumentLoading(false);
      });
  };

  useEffect(() => {
    getPropertyInfo();
  }, []);

  const handleUpload = () => {
    if (uploadDocuments.length === 0) return;

    const formData = new FormData();
    uploadDocuments.forEach((file) => {
      formData.append("files", file);
    });

    setIsUploading(true);
    ProjectsAPI.uploadPropertyFiles(Number(propertyId), formData)
      .then(() => {
        showSnackbar("Files Uploaded! ");
        fetchPropertyFiles();
        handleUploadClose();
      })
      .catch(() => {
        showSnackbar("error uploading files.", "error");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleUploadClose = () => {
    setUploadDocuments([]);
    setIsOpenUpload(false);
  };

  const DocumentColumns: GridColDef[] = [
    {
      field: "filename",
      headerName: "File Name",
      width: 280,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Link className="hover:underline" to={`#`}>
            {params?.row?.filename}
          </Link>
        );
      },
    },
    {
      field: "file_type",
      headerName: "File Type",
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        return <>{getFileExtension(params?.row?.filename)}</>;
      },
    },

    {
      field: "uploaded_at",
      headerName: "Uploaded At",
      width: 160,
      valueFormatter: (value) => formatDateTime(value),
    },

    {
      field: "action",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton aria-label={`action options`} className="ml-2 mt-1.5">
                <Ellipsis className="size-4" aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
            >
              <DropdownMenuItem>
                <Eye aria-hidden className="mr-1.5" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => {}}>
                <Download aria-hidden className="mr-1.5" />
                Download
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive">
                <Trash2 aria-hidden className="mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

      <div>
        {/* <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Project Details
        </h5> */}

        <div className="mt-1.5">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-0"
          >
            <TabsList>
              <TabsTrigger value="property">
                <Building2 aria-hidden />
                Property Details
              </TabsTrigger>
              <TabsTrigger value="lease">
                <Building aria-hidden />
                Leases
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FolderOpen aria-hidden />
                Documents
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "property" && (
            <div className="mt-4 bg-white p-4 rounded-sm shadow-card text-[0.85rem]">
              <p className="">
                <span className="font-medium inline-block min-w-[7rem]">
                  Project Name{" "}
                </span>{" "}
                : <span>{projectDetails?.project_name || "N/A"}</span>
              </p>
              <p className="mt-2.5">
                <span className="font-medium inline-block min-w-[7rem]">
                  Property Name{" "}
                </span>{" "}
                : {propertyDetails?.property_name || "N/A"}
              </p>
              <p className="mt-2.5">
                <span className="font-medium inline-block min-w-[7rem]">
                  Data Category{" "}
                </span>{" "}
                : {projectDetails?.category || "N/A"}
              </p>
              <p className="mt-2.5">
                <span className="font-medium inline-block min-w-[7rem]">
                  Property Id
                </span>{" "}
                : {propertyDetails?.property_id || "N/A"}
              </p>
              <p className="mt-2.5">
                <span className="font-medium inline-block min-w-[7rem]">
                  Lease Id
                </span>{" "}
                : {propertyDetails?.lease_id || "N/A"}
              </p>
              <p className="mt-2.5">
                <span className="font-medium inline-block min-w-[7rem]">
                  Created On{" "}
                </span>{" "}
                : {formatDateTime(projectDetails?.last_created) || "N/A"}
              </p>
            </div>
          )}

          {activeTab === "documents" && (
            <>
              <div className="flex justify-end align-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpenUpload(true)}
                >
                  <CloudUpload /> Upload Files
                </Button>
                <Button variant="primary" size="sm">
                  <Play /> Run Job
                </Button>
              </div>
              <Box
                className="app-datagrid-container mt-2"
                sx={{ height: "73.5vh", width: "100%" }}
              >
                <DataGrid
                  density="compact"
                  rows={documents}
                  columns={DocumentColumns}
                  loading={isDocumentLoading}
                  checkboxSelection
                  getRowId={(i) => i?.file_id}
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
                  sx={{
                    // Target the checkbox cell
                    "& .MuiDataGrid-checkboxInput": {
                      // Change color
                      // color: "red", // unchecked color
                      "&.Mui-checked": {
                        color: "#1f9d5b", // checked color
                      },
                      // Change size
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.25rem", // smaller icon (default ~1.5rem)
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </div>
      </div>

      <UploadFiles
        open={isOpenUpload}
        onClose={() => {
          handleUploadClose();
        }}
        isSubmitting={isUploading}
        propertyName={propertyDetails?.property_name || ""}
        uploadDocuments={uploadDocuments}
        setUploadDocuments={setUploadDocuments}
        handleUpload={handleUpload}
      />
    </div>
  );
};

export default PropertyDetails;
