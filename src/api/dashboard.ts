/* eslint-disable @typescript-eslint/no-explicit-any */
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
};

export default DashboardAPI;
