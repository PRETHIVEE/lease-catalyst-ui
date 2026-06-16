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
  Info,
  Loader,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProjectsAPI from "@/api/projects";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import StatusChip from "@/components/common/StatusChip";
import { Tooltip } from "@mui/material";
import LeaseAbstraction from "../../components/LeaseAbstraction/LeaseAbstraction";

const PropertyDetails = () => {
  const navigate = useNavigate();
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
  const [isJobSubmitting, setIsJobSubmitting] = useState(false);

  const BreadcrumbsData = [
    { label: "Projects", url: "/projects" },
    {
      label: `Projects (${projectDetails?.project_name || "..."})`,
      url: `/projects/project-details?projectId=${projectId}`,
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
      width: 420,
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
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return <>{getFileExtension(params?.row?.filename)}</>;
      },
    },

    {
      field: "uploaded_by",
      headerName: "Uploaded By",
      width: 160,
      valueFormatter: (value) => (value ? value : "-"),
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
                Preview
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => {}}>
                <Download aria-hidden className="mr-1.5" />
                Download
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onSelect={() => handleDeleteFile(params?.row?.file_id)}
              >
                <Trash2 aria-hidden className="mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDeleteFile = (file_id: number) => {
    setIsDocumentLoading(true);
    ProjectsAPI.deletePropertyFile(file_id)
      .then((response) => {
        if (response?.data) {
          setDocumnets((prev) => {
            return prev?.filter((i) => i?.file_id !== file_id);
          });
        }
      })
      .catch(() => {
        showSnackbar("error deleting files.", "error");
      })
      .finally(() => {
        setIsDocumentLoading(false);
      });
  };

  const handleRunJob = () => {
    setIsJobSubmitting(true);
    const payload = {
      property_id: Number(propertyId),
    };
    ProjectsAPI.triggerDQCWorkflow(payload)
      .then((response) => {
        if (response?.status === 200) {
          showSnackbar(response?.data?.message);
          navigate("/dashboard");
        }
      })
      .catch(() => {
        showSnackbar("Error running the job", "error");
      })
      .finally(() => {
        setIsJobSubmitting(false);
      });
  };

  const [abstractionStatus, setAbstractionStatus] = useState<any>(null);

  const getLabelVariant = (status: string) => {
    switch (status) {
      case "DQC completed":
        return "success";
      case "DQC running":
        return "pending";
      default:
        return "expired";
    }
  };

  const LabelVariant = getLabelVariant(abstractionStatus?.status);

  const fetchAbstractionStatus = () => {
    ProjectsAPI.getAbstractionStatus(String(propertyId)).then((response) => {
      if (response?.status === 200) {
        setAbstractionStatus(response?.data);
      }
    });
  };

  useEffect(() => {
    fetchAbstractionStatus();
  }, []);

  console.log("abstractionStatus:", abstractionStatus);

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

      <div>
        <div className="mt-1.5">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-0"
          >
            <TabsList>
              <TabsTrigger value="property">
                <Building2 aria-hidden />
                Property
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FolderOpen aria-hidden />
                Documents
              </TabsTrigger>
              <TabsTrigger value="lease-abstraction">
                <Building aria-hidden />
                Lease Abstraction
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "property" && (
            <div className="flex gap-4">
              {/* LEFT SECTION */}
              <div style={{ width: "50%" }}>
                {/* PROPERTY DETAILS */}
                <div className="mt-4 bg-white rounded-sm shadow-card">
                  <div className="border-b border-gray-300 py-2.5 px-4">
                    <h6 className="text-[0.84rem] font-medium">
                      Property Details
                    </h6>
                  </div>

                  <div className="py-2.5 px-4">
                    <p className="mt-1 text-[0.84rem]">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Property Name
                      </span>
                      <span>: {propertyDetails?.property_name || "N/A"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Project Name
                      </span>
                      <span>: {projectDetails?.project_name || "N/A"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Data Category
                      </span>
                      <span>: {projectDetails?.category || "NA"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        property ID
                      </span>
                      <span>: {propertyDetails?.property_id || "N/A"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Lease ID
                      </span>
                      <span>: {propertyDetails?.lease_id || "N/A"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75 my-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Created On
                      </span>
                      <span>
                        :{" "}
                        {formatDateTime(projectDetails?.last_created) || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* ABSTRACTION JOB STATUS */}
                <div className="mt-4 bg-white rounded-sm shadow-card">
                  <div className="border-b border-gray-300 py-2.5 px-4">
                    <h6 className="text-[0.84rem] font-medium">
                      Lease Abstraction Status
                    </h6>
                  </div>

                  <div className="py-2.5 px-4">
                    <div>
                      <div className="flex align-center gap-4">
                        <StatusChip
                          label={abstractionStatus?.status}
                          variant={LabelVariant}
                        />
                        <Tooltip
                          title="Current status of the Lease Abstraction Job"
                          arrow
                          placement="right"
                        >
                          <Info color="gray" size={16} className="mt-1.25" />
                        </Tooltip>
                      </div>

                      {Boolean(abstractionStatus?.timestamp) && (
                        <p className="mt-2 font-normal text-[0.71rem] text-gray-500">
                          Last updated at{" "}
                          {formatDateTime(abstractionStatus?.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="mt-4 bg-white rounded-sm shadow-card">
                  <div className="border-b border-gray-300 py-2.5 px-4">
                    <h6 className="text-[0.84rem] font-medium">Contact</h6>
                  </div>

                  <div className="py-2.5 px-4">
                    <p className="mt-1 text-[0.84rem]">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Email
                      </span>
                      <span>: {"NA"}</span>
                    </p>

                    <p className="mt-1 text-[0.84rem] mt-1.75">
                      <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                        Work Mobile
                      </span>
                      <span>: {"NA"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div style={{ width: "50%" }}>
                {/* MAP */}
                <div className="mt-4 bg-white rounded-sm shadow-card">
                  <div className="border-b border-gray-300 py-2.5 px-4">
                    <h6 className="text-[0.84rem] font-medium">Map</h6>
                  </div>

                  <div className="p-2.5">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1856.9159677645919!2d-76.61500360586942!3d39.294684713426115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c80499053a1171%3A0xd9bed96f1c2ba857!2s13%20E%20Franklin%20St%2C%20Baltimore%2C%20MD%2021202%2C%20USA!5e1!3m2!1sen!2sin!4v1781438546087!5m2!1sen!2sin"
                      width="100%"
                      height="400"
                      // style="border:0;"
                      // allowfullscreen=""
                      loading="lazy"
                      // referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "lease-abstraction" && (
            <LeaseAbstraction propertyName={propertyDetails?.property_name} />
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
                <Button
                  disabled={isJobSubmitting}
                  variant="primary"
                  size="sm"
                  onClick={handleRunJob}
                >
                  {isJobSubmitting ? (
                    <>
                      <Loader /> Running
                    </>
                  ) : (
                    <>
                      <Play /> Run Job
                    </>
                  )}
                </Button>
              </div>
              <Box
                className="app-datagrid-container mt-2"
                sx={{ height: "73.5vh", width: "100%" }}
              >
                <DataGrid
                  density="compact"
                  disableRowSelectionExcludeModel
                  rows={documents}
                  columns={DocumentColumns}
                  loading={isDocumentLoading}
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
        componentLocation="PROPERTY DETAILS"
      />
    </div>
  );
};

export default PropertyDetails;
