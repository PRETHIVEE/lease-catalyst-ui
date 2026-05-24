/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectsAPI from "@/api/projects";
import BreadCrumbs from "@/components/common/BreadCrumbs";
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
import { Ellipsis, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProject from "../components/CreateProject/CreateProject";

const BreadcrumbsData = [
  { label: "Home", url: "/home" },
  { label: "Projects", url: "/projects" },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id") || "";
  const [openCreateProject, setOpenCreateProject] = useState(false);

  const Columns: GridColDef[] = [
    {
      field: "project_name",
      headerName: "Project Name",
      width: 220,
    },
    {
      field: "category",
      headerName: "Data Category",
      width: 180,
    },

    {
      field: "property_count",
      headerName: "No of Properties",
      width: 140,
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
                  navigate(`/projects/project-details?id=${params?.row?.id}`);
                }}
              >
                <Eye aria-hidden className="mr-1.5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Plus aria-hidden className="mr-1.5" />
                Add Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    ProjectsAPI.getProjects(Number(userId))
      .then((response) => {
        if (response.statusText === "OK") {
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
  }, [userId]);

  const handleCloseProjectModal = () => {
    setOpenCreateProject(false);
  };

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

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
      />
    </div>
  );
};

export default ProjectsPage;
