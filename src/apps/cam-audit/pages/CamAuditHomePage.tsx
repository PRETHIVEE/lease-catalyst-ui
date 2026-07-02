/* eslint-disable @typescript-eslint/no-explicit-any */
import DataGridTitle from "@/components/common/DataGridTitle";
import { Button } from "@/components/ui/button";

import Box from "@mui/material/Box";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Download, FileSearch, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbarStore } from "@/store/snackbar-store";
import StatusChip from "@/components/common/StatusChip";
import { IconButton, Tooltip } from "@mui/material";
import CreateProperty from "../components/CreateProperty/CreateProperty";
import CamReconciliationAPI from "@/api/cam-reconciliation";

const CamAuditHomePage = () => {
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);

  const validationSchema = Yup.object({
    propertyName: Yup.string().required("Property /Lease Name is required"),
    propertyId: Yup.string().required("Property ID is required"),
    leaseId: Yup.string().required("Lease ID is required"),
    tenantName: Yup.string().required("Tenant Name is required"),
    camFiles: Yup.array()
      .min(1, "CAM documents must be selected")
      .required("CAM Files are required"),
  });

  const formik = useFormik({
    initialValues: {
      propertyName: "",
      propertyId: "",
      leaseId: "",
      tenantName: "",
      camFiles: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateLease(values);
    },
  });

  const Columns: GridColDef[] = [
    {
      field: "property_lease_name",
      headerName: "Property / Lease Name",
      width: 280,
    },
    {
      field: "property_id",
      headerName: "Property ID",
      width: 140,
    },

    {
      field: "property_lease_id",
      headerName: "Lease ID",
      width: 140,
    },

    {
      field: "property_lease_tenant_name",
      headerName: "Tenant Name",
      width: 174,
      renderCell: (params: GridRenderCellParams) => {
        return <div>{params?.row?.property_lease_tenant_name}</div>;
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const { status } = params.row;
        return (
          <div>
            <StatusChip
              label={status}
              variant={
                status === "New"
                  ? "new"
                  : status === "In-Progress"
                  ? "pending"
                  : status === "Under Review"
                  ? "ready"
                  : status === "Completed"
                  ? "success"
                  : "failed"
              }
            />
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        console.log("dsgsdfsdfsdf", params?.row?.id);
        const { status } = params.row;
        const isCompleted = status === "Completed";
        return (
          <span>
            {status === "New" ? (
              <Tooltip title={"Run CAM Audit"} arrow placement="bottom">
                <IconButton
                  sx={{ mr: 0.75 }}
                  size="small"
                  // onClick={handleNavigate(params?.row)}
                >
                  <Play className="size-4" aria-hidden />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={"View CAM Audit"} arrow placement="bottom">
                <IconButton
                  sx={{ mr: 0.75 }}
                  size="small"
                  // onClick={handleNavigate(params?.row)}
                  disabled={status === "New" || status === "In-Progress"}
                >
                  <FileSearch className="size-4" aria-hidden />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={"Download"} arrow placement="bottom">
              <IconButton
                size="small"
                // onClick={handleDownload(params?.row, "CSV")}
                disabled={!isCompleted}
              >
                <Download className="size-3.5" aria-hidden />
              </IconButton>
            </Tooltip>
          </span>
        );
      },
    },
  ];

  const getPropertyLeasesList = () => {
    CamReconciliationAPI.getLeases()
      .then((response) => {
        if (response.status === 200) {
          setRows(response?.data || []);
        }
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPropertyLeasesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateLease = (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("property_lease_name", data.propertyName);
    formData.append("property_id", data.propertyId);
    formData.append("property_lease_id", data.leaseId);
    formData.append("property_lease_tenant_name", data.tenantName);
    uploadDocuments.forEach((file) => {
      formData.append("cam_files", file);
    });

    CamReconciliationAPI.createLease(formData)
      .then((response) => {
        console.log("Create lease response", response);
        if (response.status === 200) {
          getPropertyLeasesList();
          showSnackbar(response.data.message || "Lease created!");
          handleCloseLeaseModal();
        }
      })
      .catch(() => {
        showSnackbar("Failed to create lease.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  const [openCreateLease, setOpenCreateLease] = useState(false);

  const handleCloseLeaseModal = () => {
    setOpenCreateLease(false);
    formik.resetForm();
    setUploadDocuments([]);
  };

  useEffect(() => {
    console.log("uploadDocuments", uploadDocuments);
    formik.setFieldValue("camFiles", uploadDocuments);
  }, [uploadDocuments]);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          CAM Reconciliation
        </h5>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setOpenCreateLease(true)}
        >
          <Plus strokeWidth={3} /> Create Property / Lease
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
        />
      </Box>

      <CreateProperty
        open={openCreateLease}
        onClose={handleCloseLeaseModal}
        formik={formik}
        isSubmitting={isSubmitting}
        uploadDocuments={uploadDocuments}
        setUploadDocuments={setUploadDocuments}
      />
    </div>
  );
};

export default CamAuditHomePage;
