/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosInstance from "./axiosInstance";

const ProjectsAPI = {
  CreateProject: (payload: any) => {
    return AxiosInstance.post(`/projects/project_create`, payload);
  },

  CreateProperty: (payload: any) => {
    return AxiosInstance.post(`/projects/property_create`, payload);
  },

  getProjects: (userId: number) => {
    return AxiosInstance.get(`/projects/projects?user_id=${userId}`);
  },

  getProjectById: (projectId: number) => {
    return AxiosInstance.get(`/projects/project/${projectId}`);
  },

  getPropertyById: (propertyId: number) => {
    return AxiosInstance.get(`/projects/property/${propertyId}`);
  },

  getPropertyList: (projectId: number) => {
    return AxiosInstance.get(`/projects/properties?project_id=${projectId}`);
  },

  getPropertyFiles: (propertyId: number) => {
    return AxiosInstance.get(`/projects/properties/files?id=${propertyId}`);
  },

  deletePropertyFile: (fileId: number) => {
    return AxiosInstance.delete(`/projects/properties/file?file_id=${fileId}`);
  },

  deleteProject: (projectId: number) => {
    return AxiosInstance.delete(`/projects/project_delete/${projectId}`);
  },

  deleteProperty: (projectId: number) => {
    return AxiosInstance.delete(`/projects/property_delete/${projectId}`);
  },

  uploadPropertyFiles: (propertyId: number, formData: FormData) => {
    return AxiosInstance.post(
      `/projects/properties/upload?id=${propertyId}`,
      formData,
    );
  },

  triggerJob: (payload: any) => {
    return AxiosInstance.post(`/workflow/trigger-job`, payload);
  },
};

export default ProjectsAPI;
