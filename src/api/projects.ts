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

  getPropertyList: (projectId: number) => {
    return AxiosInstance.get(`/projects/properties?project_id=${projectId}`);
  },
};

export default ProjectsAPI;
