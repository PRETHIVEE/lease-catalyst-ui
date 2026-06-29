/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import AxiosInstance from "./axiosInstance";

const DashboardAPI = {
  getWorkflow: (payload: any) => {
    return AxiosInstance.get(
      `/workflow/jobs/by-user_name?user_email=${payload}`,
    );
  },

  getAttributeCategories: () => {
    return AxiosInstance.get(`/attributes/categories`);
  },

  updateNotifications: (payload: any) => {
    return AxiosInstance.post(`/workflow/notifications/update`, payload);
  },

  getDqcResult: (jobId: string) => {
    return AxiosInstance.get(`/workflow/jobs/dqc-result?job_id=${jobId}`);
  },

  getNotifications: (userId: string) => {
    return AxiosInstance.get(
      `/workflow/notifications/get/${userId}?read=false`,
    );
  },

  generateSSOTokenForXdas: (payload: any) => {
    return axios.post(
      `https://xdas-one.xtract.io/authenticationservice/AuthenticationAPI/Login/GenerateSSOToken`,
      payload,
    );
  },
};

export default DashboardAPI;
