import UsersAPI from "@/api/users";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { DataGrid, type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const UserAccess = () => {
  const userId = localStorage.getItem("user_id") || "";
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAccessChecked = (value: any) => {
    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "true" ||
      value === "yes" ||
      value === "Y"
    );
  };

  const handlePermissionToggle = (
    id: GridRowId,
    field: string,
    checked: boolean,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.user_id === id ? { ...row, [field]: checked } : row,
      ),
    );
  };

  const Columns: GridColDef[] = [
    {
      field: "user_name",
      headerName: "User Name",
      width: 180,
    },

    {
      field: "role",
      headerName: "User Role",
      width: 100,
    },
    // PERMISSIONS
    // Dashboard	Upload	DQC	Abstractor	Reviewer 1	Sense check	PEG sampling	Export (Integration)

    {
      field: "dashboard_access",
      headerName: "Dashboard",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "upload_access",
      headerName: "Upload",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "dqc_access",
      headerName: `DQC`,
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "abstractor_access",
      headerName: "Abstractor",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "reviewer_access",
      headerName: "Reviewer 1",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "sense_check_access",
      headerName: "Sense check",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "peg_sampling_access",
      headerName: "PEG sampling",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
    {
      field: "export_access",
      headerName: "Export (Integration)",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          size="small"
          color="success"
          checked={getAccessChecked(params.value)}
          onChange={(event) =>
            handlePermissionToggle(
              params.id,
              params.field,
              event.target.checked,
            )
          }
        />
      ),
    },
  ];

  const getUsersList = () => {
    UsersAPI.getUsers()
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

  useEffect(() => {
    if (userId) {
      getUsersList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return (
    <div>
      <Box
        className="app-datagrid-container mt-4"
        sx={{ height: "77vh", width: "100%" }}
      >
        <DataGrid
          density="compact"
          rows={Rows}
          columns={Columns}
          loading={loading}
          getRowId={(row) => row.user_id}
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

export default UserAccess;
