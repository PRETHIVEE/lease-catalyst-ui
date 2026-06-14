/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Building2,
  Ellipsis,
  Eye,
  Plus,
  ShieldUser,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import ProjectsAPI from "@/api/projects";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbarStore } from "@/store/snackbar-store";
import { formatDateTime } from "@/utils/utils";
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
import CreateProperty from "../../components/CreateProperty/CreateProperty";
import UserAccess from "../../components/UserAccess/UserAccess";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location?.state?.tab || "project";
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const projectId = searchParams.get("projectId");
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [propertiesData, setPropertiesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCreateProperty, setOpenCreateProperty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = localStorage.getItem("user_email") || "";
  const userId = localStorage.getItem("user_id") || "";

  const BreadcrumbsData = [
    { label: "Home", url: "/dashboard" },
    { label: "Projects", url: "/projects" },
    {
      label: `Projects (${projectDetails?.project_name || "..."})`,
      url: "/",
    },
  ];

  const validationSchema = Yup.object({
    projectName: Yup.string().required("Project Name is required"),
    propertyName: Yup.string().required("Property Name is required"),
    propertyId: Yup.string().required("Property ID is required"),
    leaseId: Yup.string().required("Lease ID is required"),
    tenantName: Yup.string().required("Tenant Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      projectName: "",
      propertyName: "",
      propertyId: "",
      leaseId: "",
      tenantName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateProperty(values);
    },
  });

  const handleClosePropertyModal = () => {
    setOpenCreateProperty(false);
    formik.resetForm();
  };

  const onCreateProperty = (data: any) => {
    setIsSubmitting(true);
    const requestBody = [
      {
        project_id: projectId,
        property_id: data.propertyId,
        property_name: data.propertyName,
        lease_id: data.leaseId,
        tenant_names: [data.tenantName],
        user_id: Number(userId),
        user_name: userEmail,
      },
    ];
    ProjectsAPI.CreateProperty(requestBody)
      .then((response) => {
        if (response.status === 201) {
          getProperties();
          showSnackbar("Project created!");
          handleClosePropertyModal();
        } else {
          showSnackbar("Failed to create project.", "error");
        }
      })
      .catch((error) => {
        console.log("Failed to create property", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getProperties = () => {
    ProjectsAPI.getPropertyList(Number(projectId))
      .then((response) => {
        if (response.status === 200) {
          const data = response.data || [];
          setPropertiesData(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getProjectDetails = () => {
    ProjectsAPI.getProjectById(Number(projectId))
      .then((response) => {
        setProjectDetails(response?.data);
      })
      .catch(() => {
        // Handle error
      });
  };

  useEffect(() => {
    getProjectDetails();
    getProperties();
  }, []);

  const handleCreate = () => {
    setOpenCreateProperty(true);
    formik.setFieldValue("projectName", projectDetails?.project_name || "");
  };

  const Columns: GridColDef[] = [
    {
      field: "property_name",
      headerName: "Property Name",
      width: 220,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Link
            className="hover:underline"
            to={`/projects/project-details/property-details?projectId=${projectId}&propertyId=${params?.row?.id}`}
          >
            {params?.row?.property_name}
          </Link>
        );
      },
    },
    {
      field: "property_id",
      headerName: "Property ID",
      width: 180,
    },

    {
      field: "lease_id",
      headerName: "Lease ID",
      width: 140,
    },

    {
      field: "tenant_names",
      headerName: "Tenant Name",
      width: 174,
      renderCell: (params: GridRenderCellParams) => {
        return <div>{params?.row?.tenant_names?.join(", ")}</div>;
      },
    },

    {
      field: "action",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        console.log("dsgsdfsdfsdf", params?.row?.id);
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
              <DropdownMenuItem
                onSelect={() => {
                  navigate(`/projects/project-details?id=${params?.row?.id}`);
                }}
              >
                <Eye aria-hidden className="mr-1.5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Trash2 aria-hidden className="mr-1.5" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  console.log("propertiesData", propertiesData);
  console.log("location", location);

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
            <div className="flex justify-between items-center gap-16">
              <TabsList>
                <TabsTrigger value="project">
                  <Building2 aria-hidden />
                  Project
                </TabsTrigger>
                <TabsTrigger value="properties">
                  <Building aria-hidden />
                  Properties (Leases)
                </TabsTrigger>
                <TabsTrigger value="user-access">
                  <ShieldUser aria-hidden />
                  User Access
                </TabsTrigger>
              </TabsList>
              <Button variant="primary" onClick={() => handleCreate()}>
                <Plus strokeWidth={2} /> Add Property
              </Button>
            </div>
          </Tabs>

          {activeTab === "project" && (
            <div className="mt-4 bg-white rounded-sm shadow-card">
              <div className="border-b border-gray-300 py-2.5 px-4">
                <h6 className="text-[0.84rem] font-medium">Project Details</h6>
              </div>

              <div className="py-2.5 px-4">
                <p className="mt-1 text-[0.84rem]">
                  <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                    Project Name{" "}
                  </span>{" "}
                  <span>: {projectDetails?.project_name || "N/A"}</span>
                </p>
                <p className="mt-1 text-[0.84rem] mt-1.75">
                  <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                    Data Category{" "}
                  </span>{" "}
                  <span>: {projectDetails?.category || "N/A"}</span>
                </p>

                <p className="mt-1 text-[0.84rem] mt-1.75">
                  <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                    No of Properties{" "}
                  </span>{" "}
                  <span>: {projectDetails?.property_count || "0"}</span>
                </p>

                <p className="mt-1 text-[0.84rem] mt-1.75">
                  <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                    Active Lease Count
                  </span>{" "}
                  <span>: {"N/A"}</span>
                </p>

                <p className="mt-1 text-[0.84rem] mt-1.75 my-1.75">
                  <span className="font-normal inline-block min-w-[8rem] text-gray-500">
                    Created On{" "}
                  </span>{" "}
                  <span>
                    : {formatDateTime(projectDetails?.last_created) || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <>
              <Box
                className="app-datagrid-container mt-4"
                sx={{ height: "77vh", width: "100%" }}
              >
                <DataGrid
                  density="compact"
                  rows={propertiesData}
                  columns={Columns}
                  loading={isLoading}
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
            </>
          )}
          {activeTab === "user-access" && (
            <>
              <UserAccess />
            </>
          )}
        </div>
      </div>

      <CreateProperty
        open={openCreateProperty}
        onClose={handleClosePropertyModal}
        formik={formik}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProjectDetails;
