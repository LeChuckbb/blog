import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { AxiosError, AxiosResponse } from "axios";

export const IS_AUTH_QUERYKEY = "isAuth";

export const useIsAuthQuery = () =>
  useQuery<AxiosResponse, AxiosError>(
    [IS_AUTH_QUERYKEY],
    () => isAuthorized(),
    {
      retry: false,
      cacheTime: 0,
      suspense: false,
      useErrorBoundary: true,
    }
  );
