/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosInstance from "./axiosInstance";

const DashboardAPI = {
  // UploadFiles: (payload: any) => {
  //   return AxiosInstance.post(`/upload/upload`, payload);
  // },

  // TriggerWorkflow: (payload: any) => {
  //   return AxiosInstance.post(`/workflow/trigger-workflow?${payload}`);
  // },

  getWorkflow: (payload: any) => {
    return AxiosInstance.get(
      `/workflow/jobs/by-user_name?user_name=${payload}`
    );
  },

  // getDataCategory: (dcName: string) => {
  //   return AxiosInstance.get(`/attributes/search?category=${dcName}`);
  // },

  // getAttributes: () => {
  //   return AxiosInstance.get(`/attributes`);
  // },

  // getAttributeCategories: () => {
  //   return AxiosInstance.get(`/attributes/categories`);
  // },

  // getOutputPath: (job_id: string) => {
  //   return AxiosInstance.get(`/workflow/jobs/output-path?job_id=${job_id}`);
  // },

  // getDataCategoryPath: (dataCategoryName: string) => {
  //   return AxiosInstance.get(
  //     `/attributes/attribute-download?category=${dataCategoryName}`
  //   );
  // },

  // createDataCategory: (payload: any) => {
  //   return AxiosInstance.post(`/attributes/custom-attributes`, payload);
  // },

  // getDqcResult: (jobId: string) => {
  //   return AxiosInstance.get(`/workflow/jobs/dqc-result?job_id=${jobId}`);
  // },
};

export default DashboardAPI;
