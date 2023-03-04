import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { AxiosError, AxiosResponse } from "axios";
import { useState, useEffect } from "react";

export const IS_AUTH_QUERYKEY = "isAuth";

export const useIsAuthQuery = () => {
  const [isLogin, setIsLogin] = useState("false");

  useEffect(() => {
    if (window.sessionStorage.getItem("isLogin") === "true") setIsLogin("true");
  }, []);

  return useQuery<AxiosResponse, AxiosError>(
    [IS_AUTH_QUERYKEY],
    () => isAuthorized(),
    {
      retry: false,
      cacheTime: 0,
      suspense: false,
      useErrorBoundary: true,
      refetchOnMount: false,
      enabled: isLogin === "true",
    }
  );
};
