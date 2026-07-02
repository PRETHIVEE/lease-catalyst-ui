/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosInstance from "./axiosInstance";

const CamReconciliationAPI = {
  getLeases: () => {
    return AxiosInstance.get(`/cam_reconciliation/get-leases`);
  },

  createLease: (payload: any) => {
    return AxiosInstance.post(`/cam_reconciliation/create-lease`, payload);
  },
};

export default CamReconciliationAPI;
