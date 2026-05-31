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
};

export default ProjectsAPI;
