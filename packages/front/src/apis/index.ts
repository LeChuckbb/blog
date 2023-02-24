import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// interface MyError extends Error {
//   config: AxiosRequestConfig;
//   code?: string;
//   request?: any;
//   response?: AxiosResponse;
// }

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 202) {
      if (response.data.code === "AUE003") {
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
      } else if (response.data.code === "AUE004") {
        // 권한이 없다는 토스트 띄우기 (모달 종료하고)
        // 단, isAuth API 호출시에는 이 토스트가 출력되어선 안 된다.
        console.log("AUE004 인터셉터");
        // toast("요청에 대한 권한이 없습니다");
      }
    }
    return response;
  },
  (error) => {
    console.log("ERROR in axios intercept");
    return Promise.reject(error);
  }
);

export default axiosInstance;
