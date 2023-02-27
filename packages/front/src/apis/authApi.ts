import axiosInstance from ".";
import { LoginForm } from "../pages/liu";

export const loginAPI = (body: LoginForm) =>
  axiosInstance.post(`/auth/login`, body);

export const logoutAPI = () => axiosInstance.get(`/auth/logout`);

export const isAuthorized = () => axiosInstance.get(`/auth/isAuth`);
