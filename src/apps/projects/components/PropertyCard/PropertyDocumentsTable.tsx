import IconButton from "@/components/common/IconButton";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PropertyDocument } from "./types";
import { formatDateTime } from "@/utils/utils";
import { Download, Ellipsis, Eye, Trash2 } from "lucide-react";

type PropertyDocumentsTableProps = {
  documents: PropertyDocument[];
};

const columns: GridColDef<PropertyDocument>[] = [
  { field: "fileName", headerName: "File Name", width: 350 },
  { field: "fileType", headerName: "File Type", width: 100 },
  {
    field: "lastUpdated",
    headerName: "Last Updated",
    width: 174,
    valueFormatter: (value) => formatDateTime(value),
  },

  {
    field: "action",
    headerName: "Actions",
    minWidth: 100,
    renderCell: () => {
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
            <DropdownMenuItem onSelect={() => {}}>
              <Eye aria-hidden className="mr-1.5" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <Download aria-hidden className="mr-1.5" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <Trash2 aria-hidden className="mr-1.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PropertyDocumentsTable = ({ documents }: PropertyDocumentsTableProps) => {
  return (
    <Box className="app-datagrid-container ">
      <DataGrid
        density="compact"
        rows={documents}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        hideFooter
        columnHeaderHeight={48}
        rowHeight={48}
        sx={{
          border: "none",
          // height: gridHeight,
          // "& .MuiDataGrid-columnHeaders": { minHeight: "40px !important" },
          // "& .MuiDataGrid-columnHeader": { minHeight: "40px !important" },
        }}
      />
    </Box>
  );
};

export default PropertyDocumentsTable;
