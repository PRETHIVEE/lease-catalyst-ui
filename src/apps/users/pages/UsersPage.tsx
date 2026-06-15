/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbarStore } from "@/store/snackbar-store";
import UsersAPI from "@/api/users";
import CreateUser from "../components/CreateUser/CreateUser";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Users", url: "/users" },
];

const UsersPage = () => {
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id") || "";
  const [openCreateUser, setopenCreateUser] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const validationSchema = Yup.object({
    userRole: Yup.object().required("User Role is required"),
    userName: Yup.string().required("User Name is required"),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("User Email is required"),
    defaultPassword: Yup.string().required("Default Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      userRole: null,
      defaultPassword: "",
      companyName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateUser(values);
    },
  });

  const Columns: GridColDef[] = [
    {
      field: "user_name",
      headerName: "User Name",
      width: 220,
    },
    {
      field: "user_email",
      headerName: "User Email",
      width: 200,
    },
    {
      field: "role",
      headerName: "User Role",
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
        console.log("dsgsdfsdfsdf", params);

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
                  handleAssignProject(params.row?.user_id);
                }}
                disabled
              >
                <Pencil aria-hidden className="mr-1.5" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  handleDeleteUser(params.row);
                }}
                disabled={params.row?.role === "admin"}
              >
                <Trash2 aria-hidden className="mr-1.5" /> Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleCloseuserModal = () => {
    setopenCreateUser(false);
    formik.resetForm();
  };

  const handleAssignProject = (userId: number) => {
    console.log("Assign project to user with ID:", userId);
  };

  const handleDeleteUser = (user: any) => {
    setLoading(true);
    UsersAPI.deleteUser({ user_names: [user.user_email] })
      .then((response) => {
        if (response.status === 200) {
          getUsersList();
          showSnackbar("User deleted!");
        }
      })
      .catch(() => {
        showSnackbar("Failed to delete user.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUsersList = () => {
    UsersAPI.getUsers()
      .then((response) => {
        console.log("Get users response", response);
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
  }, [userId]);

  const onCreateUser = (data: any) => {
    setIsSubmitting(true);
    const requestBody = {
      name: data.userName,
      user_name: data.userEmail, // email is the username for now
      password: data.defaultPassword,
      role: data.userRole?.value,
      company_id: 1,
      company_name: "Mobius",
    };

    UsersAPI.CreateUser(requestBody)
      .then((response) => {
        console.log("Create user response", response);
        if (response.status === 200) {
          getUsersList();
          showSnackbar("User created!");
          handleCloseuserModal();
        }
      })
      .catch(() => {
        showSnackbar("Failed to create user.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const userRoleOptions = [
    { label: "Admin", value: "admin", isDisabled: true },
    { label: "User", value: "user", isDisabled: false },
    { label: "Client", value: "client", isDisabled: false },
  ];

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

      <div className="flex items-center justify-between">
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Users
        </h5>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setopenCreateUser(true)}
        >
          <Plus strokeWidth={3} /> Create User
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

      <CreateUser
        open={openCreateUser}
        onClose={handleCloseuserModal}
        formik={formik}
        userRoleOptions={userRoleOptions}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default UsersPage;
