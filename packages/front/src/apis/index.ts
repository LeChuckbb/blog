import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 202) {
      if (response.data.error.code === "AUE003") {
        // AUE003 -> refreshToken은 유효한데 accessToken이 만료된 경우
        // 재발급받은 access Token을 세팅하고, API 재요청하기.
        console.log("AUE003 인터셉터");

        const config = response.config;
        config.headers.Authorization = response.headers["authorization"];
        return axios.request(config);
      } else if (response.data.error.code === "AUE004") {
        // 권한이 없다는 토스트 띄우기 (모달 종료하고)
        // 단, isAuth API 호출시에는 이 토스트가 출력되어선 안 된다.
        console.log("AUE004 인터셉터");
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
