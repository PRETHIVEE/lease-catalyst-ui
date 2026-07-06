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
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/utils/utils";
import { useLayoutStore } from "@/layout/main-layout/store/layoutStore";

const CamHomePage = () => {
  const navigate = useNavigate();
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [leaseDocuments, setLeaseDocuments] = useState<File[]>([]);
  const [openCreateLease, setOpenCreateLease] = useState(false);

  const validationSchema = Yup.object({
    propertyName: Yup.string().required("Property /Lease Name is required"),
    // propertyId: Yup.string().required("Property ID is required"),
    leaseId: Yup.string().required("Lease ID is required"),
    tenantName: Yup.string().required("Tenant Name is required"),
    camFiles: Yup.array()
      .min(1, "CAM documents must be selected")
      .required("CAM Files are required"),
    leaseDocuments: Yup.array()
      .min(1, "Lease documents must be selected")
      .required("Lease Files are required"),
  });

  const formik = useFormik({
    initialValues: {
      propertyName: "",
      propertyId: "",
      leaseId: "",
      tenantName: "",
      camFiles: [],
      leaseDocuments: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      runCAMAudit(values);
    },
  });

  const Columns: GridColDef[] = [
    {
      field: "lease_prop_name",
      headerName: "Property / Lease Name",
      width: 280,
    },

    {
      field: "lease_id",
      headerName: "Lease ID",
      width: 140,
    },

    {
      field: "tenant_name",
      headerName: "Tenant Name",
      width: 174,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 174,
      valueFormatter: (value) => formatDateTime(value),
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
                  : status === "pending" || status === "running"
                    ? "pending"
                    : status === "Under Review"
                      ? "ready"
                      : status === "completed"
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
        const { status } = params.row;
        const isCompleted = status === "completed";
        return (
          <span>
            {status === "New" ? (
              <Tooltip title={"Run CAM Audit"} arrow placement="bottom">
                <IconButton
                  sx={{ mr: 0.75 }}
                  size="small"
                  onClick={() => handleRunCAMAudit(params?.row)}
                >
                  <Play className="size-4" aria-hidden />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={"View CAM Audit"} arrow placement="bottom">
                <IconButton
                  sx={{ mr: 0.75 }}
                  size="small"
                  onClick={() => handleViewCAMAudit(params?.row)}
                  disabled={status === "New" || status === "running"}
                >
                  <FileSearch className="size-4" aria-hidden />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={"Download as xlsx"} arrow placement="bottom">
              <IconButton
                size="small"
                onClick={() =>
                  handleDownload(params?.row?.audit_id, params?.row?.lease_id)
                }
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

  const handleRunCAMAudit = (data: any) => {
    handleViewCAMAudit(data);
  };

  const handleViewCAMAudit = (data: any) => {
    closeSidebar();
    navigate(
      `/cam-reconciliation/cam-audit?audit_id=${data.audit_id}&lease_id=${data.lease_id}`,
    );
  };

  const handleDownload = async (audit_id: string, lease_id: string) => {
    try {
      const blob = await CamReconciliationAPI.downloadExcel(audit_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lease_Catalyst_CAM_Audit_Grid_${audit_id}-Lease_${lease_id}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const runCAMAudit = (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("lease_prop_name", data.propertyName);
    formData.append("tenant_name", data.tenantName);
    formData.append("lease_id", data.leaseId);

    formData.append("lease_pdf", leaseDocuments[0]);
    formData.append("cam_pdf", uploadDocuments[0]);

    CamReconciliationAPI.runCAMAudit(formData)
      .then((response) => {
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

  const handleCloseLeaseModal = () => {
    setOpenCreateLease(false);
    formik.resetForm();
    setUploadDocuments([]);
    setLeaseDocuments([]);
  };

  useEffect(() => {
    formik.setFieldValue("camFiles", uploadDocuments);
    formik.setFieldValue("leaseDocuments", leaseDocuments);
  }, [uploadDocuments, leaseDocuments]);

  const getPropertyLeasesList = () => {
    CamReconciliationAPI.getJobs()
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
    const intervalId = setInterval(getPropertyLeasesList, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          getRowId={(row) => row.job_id}
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
        leaseDocuments={leaseDocuments}
        setLeaseDocuments={setLeaseDocuments}
      />
    </div>
  );
};

export default CamHomePage;
