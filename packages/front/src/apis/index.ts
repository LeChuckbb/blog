import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("인터셉터!@!!#!$!@ㅃ!@#!");
    if (response.data.message === "Login Success") {
      // 로그인 성공시 accessToken, refreshToken 설정
      console.log(response.headers);
      console.log(response.headers["authorization"]);
      // axiosInstance.defaults.headers.common["Authorization"] = "";
      axiosInstance.defaults.headers.common["Authorization"] =
        response.headers["authorization"];
    }

    if (response.status === 202) {
      console.log(response.data);
      if (response.data.error.code === "AUE003") {
        // AUE003 -> refreshToken은 유효한데 accessToken이 만료된 경우
        console.log("AUE003 인터셉터");
        console.log(response);
        // 재발급받은 access Token을 세팅하고,
        axiosInstance.defaults.headers.common["Authorization"] =
          response.headers["authorization"];
        console.log(axiosInstance.defaults.headers.common);

        // API 재요청하기
        const config = response.config;
        return axiosInstance.request(config);
      } else if (response.data.error.code === "AUE004") {
        // 권한이 없다는 토스트 띄우기 (모달 종료하고)
        // 단, isAuth API 호출시에는 이 토스트가 출력되어선 안 된다.
        console.log("AUE004 인터셉터");
        // toast("요청에 대한 권한이 없습니다");
      }
    }
    return response;
  },
  (error: Error) => {
    console.log("ERROR in axios intercept");
    return Promise.reject(error);
  }
);

export default axiosInstance;
