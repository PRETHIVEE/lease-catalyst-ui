/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardAPI from "@/api/dashboard";
import DataGridTitle from "@/components/common/DataGridTitle";
import IconButton from "@/components/common/IconButton";
import StatusChip from "@/components/common/StatusChip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fileDownloader, formatDateTime, getPresignedUrl } from "@/utils/utils";
import Box from "@mui/material/Box";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Download, Ellipsis, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsTable() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user_email") || "";
  const [loading, setLoading] = useState(true);
  const [Rows, setRows] = useState<any[]>([]);

  const getWorkFlow = () => {
    DashboardAPI.getWorkflow(userEmail)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          setRows(data || []);
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

  useEffect(() => {
    getWorkFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    { field: "job_id", headerName: "Job ID", width: 80 },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 170,
    },
    {
      field: "property_name",
      headerName: "Property / Lease Name",
      width: 170,
    },
    {
      field: "lease_id",
      headerName: "Lease ID",
      width: 100,
    },
    {
      field: "workflow_name",
      headerName: "Workflow Type",
      width: 140,
    },

    {
      field: "output_status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const { output_status } = params.row;
        const variant =
          output_status === "Completed"
            ? "success"
            : output_status === "pending" || output_status === "In Progress"
              ? "pending"
              : "failed";
        const statusLabel =
          output_status === "Completed"
            ? "Completed"
            : output_status === "pending" || output_status === "In Progress"
              ? "In Progress"
              : output_status;
        return (
          <div>
            <StatusChip label={statusLabel} variant={variant} />
          </div>
        );
      },
    },

    {
      field: "created_on",
      headerName: "Created On",
      width: 160,
      valueFormatter: (value) => formatDateTime(value),
    },

    {
      field: "action",
      headerName: "Actions",
      width: 80,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { output_status, workflow_name } = params.row;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              disabled={output_status !== "Completed"}
            >
              <IconButton
                disabled={output_status !== "Completed"}
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
              <DropdownMenuItem onSelect={handleDownload(params?.row, "CSV")}>
                <Download aria-hidden className="mr-1.5" />
                Download as CSV
              </DropdownMenuItem>
              {/* <DropdownMenuItem onSelect={handleDownload(params?.row, "JSON")}>
                <Download aria-hidden className="mr-1.5" />
                Download as JSON
              </DropdownMenuItem> */}
              <DropdownMenuItem onSelect={handleNavigate(params?.row)}>
                <FileSearch aria-hidden className="mr-1.5" />
                {workflow_name === "Lease Abstraction"
                  ? "Open HITL"
                  : "View DQC"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleNavigate = (data: any) => () => {
    if (data?.workflow_name === "Lease Abstraction") {
      window.open(
        "https://xdas-one.xtract.io/#/auth/login",
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      navigate(`/dashboard/document-qc?jobId=${data.job_id}`);
    }
  };

  const handleDownload = (data: any, type: string) => () => {
    const parsedOutputPath = data?.output_path
      ? JSON.parse(data?.output_path)
      : null;
    if (parsedOutputPath) {
      const filePath =
        type === "CSV"
          ? parsedOutputPath?.csv_s3_key
          : parsedOutputPath?.rhs_filename;
      // const csvFilePath = parsedOutputPath?.csv_s3_key;
      // const jsonFilePath = parsedOutputPath?.rhs_filename;

      // Getting Presigned URL :
      getPresignedUrl(filePath).then((url) => {
        fileDownloader(url);
      });
    }
  };

  return (
    <Box
      sx={{ height: "76vh", width: "100%", position: "relative" }}
      className="app-datagrid-container"
    >
      <DataGridTitle title="Job Overview" />
      <DataGrid
        density="compact"
        rows={Rows}
        getRowId={(i) => i?.job_id}
        columns={columns}
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
  );
}
