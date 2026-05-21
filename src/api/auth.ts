import AxiosInstance from "./axiosInstance";

const AuthAPI = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LoginAPI: (payload: any) => {
    return AxiosInstance.post(`/login`, payload);
  },
};

export default AuthAPI;
