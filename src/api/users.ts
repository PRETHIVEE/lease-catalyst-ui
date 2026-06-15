/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosInstance from "./axiosInstance";

const UsersAPI = {
  CreateUser: (payload: any) => {
    return AxiosInstance.post(`/users/user_create`, payload);
  },
  CreateCompany: (payload: any) => {
    return AxiosInstance.post(`/users/company_create`, payload);
  },
  deleteUser: (payload: any) => {
    return AxiosInstance.delete(`/users/`, { data: payload });
  },

  getUsers: () => {
    return AxiosInstance.get(`/users`);
  },

  getCompanyUsers: (company_id: number) => {
    return AxiosInstance.get(`/users`, { params: { company_id } });
  },

  getCurrentUsers: () => {
    return AxiosInstance.get(`/users/current_user`);
  },

  getCompanies: () => {
    return AxiosInstance.get(`/users/get_companies`);
  },
};

export default UsersAPI;
