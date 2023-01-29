import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

interface MyError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
}

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  withCredentials: true,
  // params: {
  //   api_key: process.env.REACT_APP_API_KEY,
  //   languages: "ko-KR",
  // },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("ERROR 인터셉트");
    if (error.response.data.code === "AUE003") {
      // AUE003 -> refreshToken은 유효한데 accessToken이 만료된 경우
      console.log("AUE003");
      console.log(error.response.data);
      // 재발급받은 access Token을 세팅하고,
      axiosInstance.defaults.headers.common["Authorization"] =
        error.response.data.accessToken;
      error.config.headers["Authorization"] = error.response.data.accessToken;
      // API 재요청하기
      const config = error.config;
      return axios.request(config);
    } else if (error.response.data.code === "AUE004") {
      // 권한이 없다는 토스트 띄우기 (모달 종료하고)
      console.log("AUE004");
      toast("요청에 대한 권한이 없습니다");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
