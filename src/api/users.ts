/* eslint-disable @typescript-eslint/no-explicit-any */
import type CreateUser from "@/apps/users/components/CreateUser/CreateUser";
import AxiosInstance from "./axiosInstance";

const UsersAPI = {
  CreateUser: (payload: any) => {
    return AxiosInstance.post(`/users/user_create`, payload);
  },
  deleteUser: (payload: any) => {
    return AxiosInstance.delete(`/users/`, { data: payload });
  },

  // CreateProperty: (payload: any) => {
  //   return AxiosInstance.post(`/projects/property_create`, payload);
  // },

  getUsers: () => {
    return AxiosInstance.get(`/users`);
  },

  // getProjectById: (projectId: number) => {
  //   return AxiosInstance.get(`/projects/project/${projectId}`);
  // },

  // getPropertyById: (propertyId: number) => {
  //   return AxiosInstance.get(`/projects/property/${propertyId}`);
  // },

  // getPropertyList: (projectId: number) => {
  //   return AxiosInstance.get(`/projects/properties?project_id=${projectId}`);
  // },

  // getPropertyFiles: (propertyId: number) => {
  //   return AxiosInstance.get(`/projects/properties/files?id=${propertyId}`);
  // },

  // deletePropertyFile: (fileId: number) => {
  //   return AxiosInstance.delete(`/projects/properties/file?file_id=${fileId}`);
  // },

  // uploadPropertyFiles: (propertyId: number, formData: FormData) => {
  //   return AxiosInstance.post(
  //     `/projects/properties/upload?id=${propertyId}`,
  //     formData
  //   );
  // },

  // triggerJob: (payload: any) => {
  //   return AxiosInstance.post(`/workflow/trigger-job`, payload);
  // },
};

export default UsersAPI;
