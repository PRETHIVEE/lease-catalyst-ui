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
import { formatDateTime } from "@/utils/utils";
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
    { field: "job_id", headerName: "Job ID", width: 98 },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 160,
    },
    {
      field: "property_name",
      headerName: "Property / Lease Name",
      width: 200,
    },
    {
      field: "lease_id",
      headerName: "Lease ID",
      width: 120,
    },
    {
      field: "workflow_name",
      headerName: "Workflow Type",
      width: 150,
    },

    {
      field: "output_status",
      headerName: "Status",
      width: 130,
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
        return <StatusChip label={statusLabel} variant={variant} />;
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

      // minWidth: 50,
      // flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const { output_status } = params.row;
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
              <DropdownMenuItem onSelect={() => {}}>
                <Download aria-hidden className="mr-1.5" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigate(`/dashboard/document-qc?jobId=${params.row.job_id}`);
                }}
              >
                <FileSearch aria-hidden className="mr-1.5" />
                View DQC
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Box
      sx={{ height: "70.75vh", width: "100%", position: "relative" }}
      className="app-datagrid-container"
    >
      <DataGridTitle title=" Job Overview" />
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
