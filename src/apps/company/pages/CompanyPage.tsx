/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Ellipsis, List, Plus, Trash2, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbarStore } from "@/store/snackbar-store";
import UsersAPI from "@/api/users";
import CreateCompany from "../components/CreateCompany/CreateCompany";
import CreateUser from "@/apps/users/components/CreateUser/CreateUser";
import { useNavigate } from "react-router-dom";

const CompanyPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCreateCompany, setopenCreateCompany] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const validationSchema = Yup.object({
    companyName: Yup.string().required("Company Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      companyName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleCreateCompany(values);
    },
  });

  const uservalidationSchema = Yup.object({
    userRole: Yup.object().required("User Role is required"),
    userName: Yup.string().required("User Name is required"),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("User Email is required"),
    defaultPassword: Yup.string().required("Default Password is required"),
  });

  const userFormik = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      userRole: { label: "Admin", value: "admin", isDisabled: true },
      defaultPassword: "",
      company: null,
    },
    validationSchema: uservalidationSchema,
    onSubmit: (values) => {
      onCreateUser(values);
    },
  });

  const onCreateUser = (data: any) => {
    setIsSubmitting(true);
    const requestBody = {
      user_name: data.userName,
      user_email: data.userEmail,
      password: data.defaultPassword,
      role: data.userRole?.value,
      company_id: data.company?.id,
      company_name: data.company?.name,
    };

    UsersAPI.CreateUser(requestBody)
      .then((response) => {
        if (response.status === 200) {
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

  const Columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Company Name",
      width: 220,
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
                  setOpenCreateUser(true);
                  userFormik.setFieldValue("company", params?.row);
                }}
              >
                <UserRoundPlus aria-hidden className="mr-1.5" />
                Create Admin User
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigate(
                    `/company/module-access?companyId=${params?.row?.id}`,
                    {
                      state: {
                        tab: "module-access",
                      },
                    },
                  );
                }}
              >
                <List aria-hidden className="mr-1.5" />
                Modules acesss control
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 aria-hidden className="mr-1.5" /> Delete Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleClosecompanyModal = () => {
    setopenCreateCompany(false);
    formik.resetForm();
  };

  const handleCloseuserModal = () => {
    setOpenCreateUser(false);
    userFormik.resetForm();
  };

  const getCompanyList = () => {
    UsersAPI.getCompanies()
      .then((response) => {
        if (response.status === 200) {
          setRows(response?.data);
        } else {
          setRows([]);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCompanyList();

    // eslint-F-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCompany = (data: any) => {
    setIsSubmitting(true);
    const requestBody = {
      name: data.companyName,
    };

    UsersAPI.CreateCompany(requestBody)
      .then((response) => {
        if (response.status === 201) {
          getCompanyList();
          showSnackbar("Company created!");
          handleClosecompanyModal();
        }
      })
      .catch(() => {
        showSnackbar("Failed to create company.", "error");
        handleClosecompanyModal();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Company
        </h5>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setopenCreateCompany(true)}
        >
          <Plus strokeWidth={3} /> Create Company
        </Button>
      </div>

      <Box
        sx={{ height: "80vh", width: "100%" }}
        className="app-datagrid-container mt-2"
      >
        <DataGridTitle title="" />
        <DataGrid
          density="compact"
          rows={Rows}
          columns={Columns}
          loading={loading}
          // getRowId={(row) => row.user_id}
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

      <CreateCompany
        open={openCreateCompany}
        onClose={handleClosecompanyModal}
        formik={formik}
        isSubmitting={isSubmitting}
      />

      <CreateUser
        formik={userFormik}
        isSubmitting={isSubmitting}
        open={openCreateUser}
        onClose={handleCloseuserModal}
        userRoleOptions={[]}
      />
    </div>
  );
};

export default CompanyPage;
