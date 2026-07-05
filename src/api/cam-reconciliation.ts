/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import AxiosInstance from "./axiosInstance";

const CamReconciliationAPI = {
  getLeases: () => {
    return AxiosInstance.get(`/cam_reconciliation/get-leases`);
  },

  createLease: (payload: any) => {
    return AxiosInstance.post(`/cam_reconciliation/create-lease`, payload);
  },

  runCAMAudit: (payload: any) => {
    return axios.post(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/jobs`,
      payload,
    );
  },

  getJobs: () => {
    return axios.get(`${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/jobs`);
  },
  downloadExcel: async (auditId: string): Promise<Blob> => {
    const response = await axios.get<Blob>(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/worksheets/unified-audit-grid/export`,
      { responseType: "blob" },
    );
    return response.data;
  },

  getWidgets: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/widgets`,
    );
  },

  getConsolidatedWorksheetsData: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/worksheets`,
    );
  },

  updateRecaclWorksheetsData: (auditId: string, payload: any) => {
    return axios.put(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/worksheets`,
      payload,
    );
  },

  getCamPdfUrl: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/documents/cam`,
    );
  },

  getLeasePdfUrl: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/documents/lease`,
    );
  },

  getLeaseOperatingCosts: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/lease-operating-costs`,
    );
  },

  getCamLineItems: (auditId: string) => {
    return axios.get(
      `${import.meta.env.VITE_CAM_AUDIT_API_URL}/api/v1/audits/${auditId}/cam-line-items`,
    );
  },
};

export default CamReconciliationAPI;
