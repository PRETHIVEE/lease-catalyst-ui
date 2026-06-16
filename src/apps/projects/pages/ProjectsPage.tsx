/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectsAPI from "@/api/projects";
import DataGridTitle from "@/components/common/DataGridTitle";
import IconButton from "@/components/common/IconButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/utils/utils";
import Box from "@mui/material/Box";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Ellipsis, Eye, Plus, ShieldUser, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateProject from "../components/CreateProject/CreateProject";
import { useFormik } from "formik";
import * as Yup from "yup";
import DashboardAPI from "@/api/dashboard";
import { useSnackbarStore } from "@/store/snackbar-store";

interface DataCategory {
  attribute: string;
  description: string;
  status: string;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id") || "";
  const userEmail = localStorage.getItem("user_email") || "";
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [dataCategoryList, setDataCategoryList] = useState<DataCategory[]>([]);
  const { showSnackbar } = useSnackbarStore();

  const validationSchema = Yup.object({
    projectName: Yup.string().required("Project Name is required"),
    template: Yup.object().required("Data Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      projectName: "",
      template: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateProject(values);
    },
  });

  const Columns: GridColDef[] = [
    {
      field: "project_name",
      headerName: "Project Name",
      width: 280,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Link
            className="column-cell-link"
            to={`/projects/project-details?projectId=${params?.row?.id}`}
          >
            {params?.row?.project_name}
          </Link>
        );
      },
    },
    {
      field: "category",
      headerName: "Data Category",
      width: 180,
    },

    {
      field: "property_count",
      headerName: "No of Properties / Leases",
      width: 160,
    },

    {
      field: "last_created",
      headerName: "Created On",
      width: 174,
      valueFormatter: (value) => formatDateTime(value),
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
                  navigate(
                    `/projects/project-details?projectId=${params?.row?.id}`,
                    {
                      state: {
                        tab: "project",
                      },
                    },
                  );
                }}
              >
                <Eye aria-hidden className="mr-1.5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigate(
                    `/projects/project-details?projectId=${params?.row?.id}`,
                    { state: { tab: "properties" } },
                  );
                }}
              >
                <Plus aria-hidden className="mr-1.5" />
                Add Property
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigate(
                    `/projects/project-details?projectId=${params?.row?.id}`,
                    {
                      state: {
                        tab: "user-access",
                      },
                    },
                  );
                }}
              >
                <ShieldUser aria-hidden className="mr-1.5" />
                User Access
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  deleteProject(params.row?.id);
                }}
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

  const handleCloseProjectModal = () => {
    setOpenCreateProject(false);
    formik.resetForm();
  };

  const getDataCategoryList = () => {
    DashboardAPI.getAttributeCategories()
      .then(({ status, data }) => {
        if (status !== 200) throw new Error();

        const merged = [
          ...(Array.isArray(data?.custom) ? data.custom : []),
          ...(Array.isArray(data?.default) ? data.default : []),
        ];

        setDataCategoryList(
          merged.map(({ attribute, description, status = "" }) => ({
            attribute,
            description,
            status,
          })),
        );
      })
      .catch(() => setDataCategoryList([]));
  };

  const getProjectList = () => {
    ProjectsAPI.getProjects(Number(userId))
      .then((response) => {
        if (response.status === 200) {
          setRows(response.data);
        } else {
          setRows([]);
        }
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteProject = (projectId: number) => {
    ProjectsAPI.deleteProject(projectId)
      .then(() => {
        showSnackbar("Project deleted", "success");
        getProjectList();
      })
      .catch(() => {
        showSnackbar("Failed to delete project. Please try again.", "error");
      });
  };

  useEffect(() => {
    if (userId) {
      getProjectList();
      getDataCategoryList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onCreateProject = (data: any) => {
    setIsSubmitting(true);
    const requestBody = {
      project_name: data.projectName,
      category: data.template?.attribute,
      property_count: 0,
      user_id: Number(userId),
      user_name: userEmail,
    };

    ProjectsAPI.CreateProject(requestBody)
      .then((response) => {
        if (response.status === 201) {
          getProjectList();
          showSnackbar("Project created!");
        }
      })
      .catch(() => {
        showSnackbar("Failed to create project.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
        handleCloseProjectModal();
      });
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Projects
        </h5>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setOpenCreateProject(true)}
        >
          <Plus strokeWidth={3} /> Create Project
        </Button>
      </div>

      <Box
        sx={{ height: "80vh", width: "100%" }}
        className="app-datagrid-container mt-2"
      >
        <DataGridTitle title=" " />
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

      <CreateProject
        open={openCreateProject}
        onClose={handleCloseProjectModal}
        formik={formik}
        dataCategoryOptions={dataCategoryList}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProjectsPage;
