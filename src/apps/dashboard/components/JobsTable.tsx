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
import { Download, Pencil, Ellipsis, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsTable() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user_email") || "";
  const [loading, setLoading] = useState(true);
  const [Rows, setRows] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    running: 0,
    failed: 0,
    completed: 0,
  });

  const getWorkFlow = () => {
    setLoading(true);
    DashboardAPI.getWorkflow(userEmail)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          setRows(data || []);

          const stat = data.reduce(
            (
              acc: {
                total: number;
                running: number;
                failed: number;
                completed: number;
              },
              row: { output_status: string }
            ) => {
              const { output_status } = row;
              switch (output_status) {
                case "Completed":
                  acc.completed += 1;
                  break;
                case "Aborted":
                case "Error":
                case "Terminated":
                  acc.failed += 1;
                  break;
                case "pending":
                  acc.running += 1;
                  break;
                case "In Progress":
                  acc.running += 1;
                  break;
                default:
                  break;
              }
              return acc;
            },
            { total: data.length, running: 0, failed: 0, completed: 0 }
          );
          setStatistics(stat);
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
  }, []);

  const columns: GridColDef[] = [
    { field: "job_id", headerName: "Job ID", width: 98 },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 190,
    },
    {
      field: "property_name",
      headerName: "Property Name",
      width: 200,
    },
    {
      field: "lease_id",
      headerName: "Lease ID",
      width: 130,
    },

    {
      field: "output_status",
      headerName: "Status",
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        const { output_status } = params.row;
        const variant =
          output_status === "Completed"
            ? "success"
            : output_status === "pending" || output_status === "In Progress"
            ? "pending"
            : "failed";
        return <StatusChip label={output_status} variant={variant} />;
      },
    },

    {
      field: "created_on",
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
